import { z as validation } from 'zod';
import { message, superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';

import AuthService from '$core/auth/auth.service';
import type { Actions, PageServerLoadEvent, RequestEvent } from './$types';
import { UserTransformer } from '$datastores/user/user.transformer';
import { SessionTransformer } from '$core/auth/auth.transformer';
import { defaultRedirect } from '$core/auth/auth.type';
import { fail } from '@sveltejs/kit';
import { ProgramDatastore } from '$datastores/program/program.svelte';

const signupSchema = validation.object({
  email: validation.string().email(),
  username: validation.string().min(3).max(20),
  firstName: validation.string().min(2).max(30),
  lastName: validation.string().min(2).max(30),
  password: validation.string().min(8).max(20),
  programId: validation.string().regex(/^\d+$/, 'Must be an integer'),
  studentId: validation.string().regex(/^\d{4}-\d{5}$/, 'Must follow the format YYYY-NNNNN'),
});

export const load = async (event: PageServerLoadEvent) => {
  const signupForm = await superValidate(event, zod(signupSchema));
  const programCollection = await ProgramDatastore.get({});

  return {
    signupForm,
    programs: programCollection.value ?? [],
  };
}

export const actions: Actions = { signup };

async function signup(event: RequestEvent) {
  const signupForm = await superValidate(event, zod(signupSchema));

  if (!signupForm.valid) {
    return fail(400, {
      success: false,
      ...message(signupForm, 'signup failed'),
      message: signupForm.message,
      error: Object.entries(signupForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const {
    email,
    username,
    firstName,
    lastName,
    password,
    programId,
    studentId
  } = signupForm.data;

  const signupResponse = await AuthService.signup({
    email: email,
    username: username,
    firstName: firstName,
    lastName: lastName,
    password: password,
    programId: Number(programId),
    studentId: studentId,
    cookies: event.cookies,
    locals: event.locals,
  });

  if (!signupResponse) {
    return fail(500, {
      success: false,
      form: signupForm,
      message: 'Internal server error',
      error: 'Internal server error'
    });
  }

  if (signupResponse.errors) {
    return fail(400, {
      success: false,
      form: signupForm,
      message: signupResponse.message,
      error: signupResponse.errors
    });
  }

  if (!signupResponse.data) {
    return fail(500, {
      success: false,
      form: signupForm,
      message: 'signup failed',
      error: 'Internal server error'
    });
  }

  const { user: userResponse, session: sessionResponse } = signupResponse.data;
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
    ...message(signupForm, 'signup successful')
  };
}