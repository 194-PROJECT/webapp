import { fail, redirect } from '@sveltejs/kit';
import { z as validation } from 'zod';
import { message, superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';

import AuthService from '$core/auth/auth.service';
import type { Actions, PageServerLoadEvent, RequestEvent } from './$types';

const baseRedirect = '/admin';

/**
 * Schema for validating login form data.
 */
const loginSchema = validation.object({
	email: validation.string().email(),
	password: validation.string().min(8)
});

/**
 * Load function to handle the initial page load.
 * Redirects to /admin if the user is already logged in.
 *
 * @param event - The page server load event.
 * @returns An object containing the form data.
 */
export const load = async (event: PageServerLoadEvent) => {
	if (event.locals.session != null && event.locals.user != null) {
		return redirect(302, baseRedirect);
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
  const loginData = await AuthService.login(email, password, undefined);

  if (!loginData) {
    throw new Error('not valid');
  }

	const { user, session } = loginData;

	event.cookies.set('session', JSON.stringify(session), {
		secure: true,
		httpOnly: true,
		path: '/'
	});
	event.cookies.set('user', JSON.stringify(user), {
		secure: true,
		httpOnly: true,
		path: '/'
	});

	return {
		user,
		session,
		success: true,
		redirect: baseRedirect,
		...message(loginForm, 'login successful')
	};
}
