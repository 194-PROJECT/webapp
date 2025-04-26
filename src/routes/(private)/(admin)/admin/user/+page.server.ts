import type { Actions, PageServerLoad, PageServerLoadEvent } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z as validation } from 'zod';
import { UserDatastore } from '$datastores/user/user.svelte';
import type { RequestEvent } from './$types';
import { deleteModelSchema, getModelSchema } from '$core/helpers/request';
import { fail } from '@sveltejs/kit';
import { UserRole, UserType } from '$core/auth/auth.type';
import AuthService from '$core/auth/auth.service';
import validator from "validator";

const userCreateSchema = validation.object({
  email: validation.string().email(),
  phoneNumber: validation.string().regex(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/).optional(),
  username: validation.string().min(3).max(20),
  firstName: validation.string().min(2).max(30),
  lastName: validation.string().min(2).max(30),
  password: validation.string().min(8).max(20),
  type: validation.nativeEnum(UserType),
  role: validation.nativeEnum(UserRole),
});

const userUpdateSchema = validation.object({
  id: validation.number(),
  email: validation.string().email(),
  phoneNumber: validation.string().regex(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/).optional(),
  username: validation.string().min(3).max(20),
  firstName: validation.string().min(2).max(30),
  lastName: validation.string().min(2).max(30),
  password: validation.string().min(8).max(20).optional(),
  type: validation.nativeEnum(UserType),
  role: validation.nativeEnum(UserRole),
});

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
	const userGetPageForm = await superValidate(event.url.searchParams, zod(getModelSchema));

  if (!userGetPageForm.valid) {
    return {
      form: userGetPageForm,
      error: 'Invalid form data'
    };
  }

	const userCollection = await UserDatastore.get({
    field: userGetPageForm.data.field,
    operator: userGetPageForm.data.operator,
    value: userGetPageForm.data.value,
		page: Number(userGetPageForm.data.pageIndex),
		page_size: Number(userGetPageForm.data.pageSize),
    order_by: 'id',
    order_direction: 'DESC',
	});

	return {
		form: userGetPageForm,
		users: userCollection.value ?? [],
    rowCount: userCollection.totalRows ?? 0,
	};
};

/**
 * Actions for handling form submissions.
 */
export const actions: Actions = {
  getPageData,
  deleteUser,
  updateUser,
  createUser,
};

/**
 * Fetches the data for the user page.
 * @param event The request event.
 * @returns The user page data.
 */
async function getPageData(event: RequestEvent) {
  const request = await event.request.json();
	const userGetPageForm = await superValidate(request, zod(getModelSchema));

	if (!userGetPageForm.valid) {
		return fail(401, {
      form: userGetPageForm,
      error: 'Invalid form data',
    });
	}

  const url = `${event.url.pathname}?${new URLSearchParams(userGetPageForm.data).toString()}`;

  return {
    success: true,
    redirect: url,
    ...message(userGetPageForm, 'user page data fetch successful')
  };
}

/**
 * Deletes a user from the database.
 * @param event
 * @returns
 */
async function deleteUser(event: RequestEvent) {
  const request = await event.request.json();
  const userDeleteForm = await superValidate(request, zod(deleteModelSchema));

  if (!userDeleteForm.valid) {
    return fail(401, {
      form: userDeleteForm,
      message: 'Invalid form data',
      error: 'Invalid form data',
    });
  }

  const document = await UserDatastore.remove(userDeleteForm.data.id);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: userDeleteForm,
      message: 'user delete failed',
      error: document.response.message
    });
  }

  return {
    success: true,
    form: userDeleteForm,
    ...message(userDeleteForm, 'user delete successful')
  };
}

async function createUser(event: RequestEvent) {
  const userCreateForm = await superValidate(event, zod(userCreateSchema));

  if (!userCreateForm.valid) {
    return fail(401, {
      form: userCreateForm,
      message: 'Invalid form data',
      error: Object.entries(userCreateForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  userCreateForm.data.password = AuthService.encrypt(userCreateForm.data.password);
  const document = await UserDatastore.push(userCreateForm.data);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: userCreateForm,
      message: 'user create failed',
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: userCreateForm,
    ...message(userCreateForm, 'user create successful')
  };
}

/**
 * Updates a user in the database.
 * @param event
 * @returns
 */
async function updateUser(event: RequestEvent) {
  const userUpdateForm = await superValidate(event, zod(userUpdateSchema));

  if (!userUpdateForm.valid) {
    return fail(401, {
      form: userUpdateForm,
      message: 'Invalid form data',
      error: Object.entries(userUpdateForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  if(userUpdateForm.data.password) {
    userUpdateForm.data.password = AuthService.encrypt(userUpdateForm.data.password);
  }

  const document = await UserDatastore.update(userUpdateForm.data.id, userUpdateForm.data);

  if (document.response?.status && document.response.status >= 400) {
    console.error(document.response);
    return fail(document.response.status, {
      form: userUpdateForm,
      message: document.response.message,
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: userUpdateForm,
    user: document.value,
    ...message(userUpdateForm, 'user update successful')
  };
}
