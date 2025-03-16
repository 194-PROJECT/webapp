import { redirect } from '@sveltejs/kit';
import { z as validation } from 'zod';
import { message, superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';

import AuthService from '$core/auth/auth.service';
import type { Actions, PageServerLoadEvent, RequestEvent } from './$types';
import { UserTransformer } from '$datastores/user/user.transformer';
import { SessionTransformer } from '$core/auth/auth.transformer';
import { Roles } from '$core/auth/auth.type';

const defaultRedirect: Record<Roles, string> = {
  [Roles.ADMIN]: '/admin',
  [Roles.USER]: '/',
  [Roles.GUEST]: '/',
};

/**
 * Schema for validating login form data.
 */
const loginSchema = validation.object({
	email: validation.string().email(),
	password: validation.string().min(8)
});

/**
 * Load function to handle the initial page load.
 * Redirects to default if the user is already logged in.
 *
 * @param event - The page server load event.
 * @returns An object containing the form data.
 */
export const load = async (event: PageServerLoadEvent) => {
	if (event.locals.user != null) {
		return redirect(302, defaultRedirect[event.locals.user.role]);
	}

	const loginForm = await superValidate(event, zod(loginSchema));

	return {
		loginForm
	};
};

/**
 * Actions for handling form submissions.
 */
export const actions: Actions = { login };

/**
 * Login function to handle the login form submission.
 * Validates the form data and returns appropriate responses.
 *
 * @param event - The request event.
 * @returns A response object indicating success or failure.
 */
async function login(event: RequestEvent) {
	// TODO: Assumes X-Forwarded-For is always included.
	const loginForm = await superValidate(event, zod(loginSchema));

	if (!loginForm.valid) {
		return message(loginForm, 'login failed');
	}

	const { email, password } = loginForm.data;
  const loginResponse = await AuthService.login({
    email: email,
    password: password,
    username: undefined,
    cookies: event.cookies,
    locals: event.locals
  });

  if (!loginResponse) {
    throw new Error('not valid');
  }

  if(loginResponse.errors) {
    return {
      success: false,
      redirect: '/login',
      ...message(loginForm, 'login failed'),
      message: loginResponse.message,
      errors: loginResponse.errors
    };
  }

  const { user: userResponse, session: sessionResponse } = loginResponse.data;
  const user = UserTransformer.transform(userResponse);
  const session = SessionTransformer.transform(sessionResponse);

	event.cookies.set('user', JSON.stringify(user), {
		secure: true,
		httpOnly: true,
		path: '/'
	});

	event.cookies.set('session', JSON.stringify(session), {
		secure: true,
		httpOnly: true,
		path: '/'
	});

  event.locals.user = user;
  event.locals.session = session;

	return {
		user,
		session,
		success: true,
		redirect: defaultRedirect[user.role],
		...message(loginForm, 'login successful')
	};
}
