import type { Actions, PageServerLoad, PageServerLoadEvent } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z as validation } from 'zod';
import { StudentDatastore } from '$datastores/student/student.svelte';
import type { RequestEvent } from './$types';
import { deleteModelSchema, getModelSchema } from '$core/helpers/request';
import { fail } from '@sveltejs/kit';
import { UserDatastore } from '$datastores/user/user.svelte';
import { Operator } from '$core/backend/request.type';
import { StudentTransformer } from '$datastores/student/student.transformer';

const studentCreateSchema = validation.object({
  userId: validation.number(),
  programId: validation.number(),
  studentId: validation.string().min(5).max(20),
});

const studentUpdateSchema = validation.object({
  id: validation.number(),
  programId: validation.number(),
  studentId: validation.string().min(5).max(20),
});

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
	const studentGetPageForm = await superValidate(event.url.searchParams, zod(getModelSchema));

  if (!studentGetPageForm.valid) {
    return {
      form: studentGetPageForm,
      error: 'Invalid form data'
    };
  }

	const studentCollection = await StudentDatastore.get({
    field: studentGetPageForm.data.field,
    operator: studentGetPageForm.data.operator,
    value: studentGetPageForm.data.value,
		page: Number(studentGetPageForm.data.pageIndex),
		page_size: Number(studentGetPageForm.data.pageSize)
	});

  const userCollection = await UserDatastore.get({
    field: 'id',
    operator: Operator.IN,
    value: studentCollection.value?.map((student) => student.userId),
  });

  const studentUsers = StudentTransformer.transformStudentUsers(
		studentCollection.value ?? [],
		userCollection.value ?? []
	);

	return {
		form: studentGetPageForm,
    studentUsers: studentUsers,
    rowCount: studentCollection.totalRows ?? 0,
	};
};

/**
 * Actions for handling form submissions.
 */
export const actions: Actions = {
  getPageData,
  deleteStudent,
  updateStudent,
  createStudent,
};

/**
 * Fetches the data for the student page.
 * @param event The request event.
 * @returns The student page data.
 */
async function getPageData(event: RequestEvent) {
  const request = await event.request.json();
	const studentGetPageForm = await superValidate(request, zod(getModelSchema));

	if (!studentGetPageForm.valid) {
		return fail(401, {
      form: studentGetPageForm,
      error: 'Invalid form data',
    });
	}

  const url = `${event.url.pathname}?${new URLSearchParams(studentGetPageForm.data).toString()}`;

  return {
    success: true,
    redirect: url,
    ...message(studentGetPageForm, 'student page data fetch successful')
  };
}

/**
 * Deletes a student from the database.
 * @param event
 * @returns
 */
async function deleteStudent(event: RequestEvent) {
  const request = await event.request.json();
  const studentDeleteForm = await superValidate(request, zod(deleteModelSchema));

  if (!studentDeleteForm.valid) {
    return fail(401, {
      form: studentDeleteForm,
      message: 'Invalid form data',
      error: 'Invalid form data',
    });
  }

  const document = await StudentDatastore.remove(studentDeleteForm.data.id);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: studentDeleteForm,
      message: 'student delete failed',
      error: document.response.message
    });
  }

  return {
    success: true,
    form: studentDeleteForm,
    ...message(studentDeleteForm, 'student delete successful')
  };
}

async function createStudent(event: RequestEvent) {
  const studentCreateForm = await superValidate(event, zod(studentCreateSchema));

  if (!studentCreateForm.valid) {
    return fail(401, {
      form: studentCreateForm,
      message: 'Invalid form data',
      error: Object.entries(studentCreateForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const document = await StudentDatastore.push(studentCreateForm.data);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: studentCreateForm,
      message: 'student create failed',
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: studentCreateForm,
    ...message(studentCreateForm, 'student create successful')
  };
}

/**
 * Updates a student in the database.
 * @param event
 * @returns
 */
async function updateStudent(event: RequestEvent) {
  const studentUpdateForm = await superValidate(event, zod(studentUpdateSchema));

  if (!studentUpdateForm.valid) {
    return fail(401, {
      form: studentUpdateForm,
      message: 'Invalid form data',
      error: Object.entries(studentUpdateForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const document = await StudentDatastore.update(studentUpdateForm.data.id, studentUpdateForm.data);

  if (document.response?.status && document.response.status >= 400) {
    console.error(document.response);
    return fail(document.response.status, {
      form: studentUpdateForm,
      message: document.response.message,
      errors: document.response.errors,
    });
  }

  return {
    success: true,
    form: studentUpdateForm,
    ...message(studentUpdateForm, 'student update successful')
  };
}
