import type { Actions, PageServerLoad, PageServerLoadEvent } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z as validation } from 'zod';
import type { RequestEvent } from './$types';
import { deleteModelSchema, getModelSchema } from '$core/helpers/request';
import { fail } from '@sveltejs/kit';
import { DepartmentDatastore } from '$datastores/department/department.svelte';
import { SemesterDatastore } from '$datastores/semester/semester.svelte';

const semesterCreateSchema = validation.object({
  name: validation.string().min(1).max(100),
  startDate: validation.date(),
  endDate: validation.date(),
});

const semesterUpdateSchema = validation.object({
  id: validation.number(),
  name: validation.string().min(1).max(100),
  startDate: validation.date(),
  endDate: validation.date(),
});

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
  const semesterGetPageForm = await superValidate(event.url.searchParams, zod(getModelSchema));

  if (!semesterGetPageForm.valid) {
    return {
      form: semesterGetPageForm,
      error: 'Invalid form data'
    };
  }

  const semesterCollection = await SemesterDatastore.get({
    field: semesterGetPageForm.data.field,
    operator: semesterGetPageForm.data.operator,
    value: semesterGetPageForm.data.value,
    page: Number(semesterGetPageForm.data.pageIndex),
    page_size: Number(semesterGetPageForm.data.pageSize)
  });

  const data = semesterCollection.value?.map((semester) => {
    return {
      semester: semester,
    }
  });

  return {
    form: semesterGetPageForm,
    semesterData: data ?? [],
    rowCount: semesterCollection.totalRows ?? 0,
  };
};

/**
 * Actions for handling form submissions related to semesters.
 */
export const actions: Actions = {
  getPageData,
  deleteSemester,
  updateSemester,
  createSemester,
};

/**
 * Fetches the data for the semester page.
 * @param event The request event.
 * @returns The semester page data.
 */
async function getPageData(event: RequestEvent) {
  const request = await event.request.json();
  const semesterGetPageForm = await superValidate(request, zod(getModelSchema));

  if (!semesterGetPageForm.valid) {
    return fail(401, {
      form: semesterGetPageForm,
      error: 'Invalid form data',
    });
  }

  const url = `${event.url.pathname}?${new URLSearchParams(semesterGetPageForm.data).toString()}`;

  return {
    success: true,
    redirect: url,
    ...message(semesterGetPageForm, 'Semester page data fetch successful'),
  };
}

/**
 * Deletes a semester from the database.
 * @param event
 * @returns
 */
async function deleteSemester(event: RequestEvent) {
  const request = await event.request.json();
  const semesterDeleteForm = await superValidate(request, zod(deleteModelSchema));

  if (!semesterDeleteForm.valid) {
    return fail(401, {
      form: semesterDeleteForm,
      message: 'Invalid form data',
      error: 'Invalid form data',
    });
  }

  const document = await SemesterDatastore.remove(semesterDeleteForm.data.id);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: semesterDeleteForm,
      message: 'Semester delete failed',
      error: document.response.message,
    });
  }

  return {
    success: true,
    form: semesterDeleteForm,
    ...message(semesterDeleteForm, 'Semester delete successful'),
  };
}

/**
 * Creates a new semester in the database.
 * @param event
 * @returns
 */
async function createSemester(event: RequestEvent) {
  const semesterCreateForm = await superValidate(event, zod(semesterCreateSchema));

  if (!semesterCreateForm.valid) {
    return fail(401, {
      form: semesterCreateForm,
      message: 'Invalid form data',
      error: Object.entries(semesterCreateForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const document = await SemesterDatastore.push(semesterCreateForm.data);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: semesterCreateForm,
      message: 'Semester create failed',
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: semesterCreateForm,
    ...message(semesterCreateForm, 'Semester create successful'),
  };
}

/**
 * Updates a semester in the database.
 * @param event
 * @returns
 */
async function updateSemester(event: RequestEvent) {
  const semesterUpdateForm = await superValidate(event, zod(semesterUpdateSchema));

  if (!semesterUpdateForm.valid) {
    return fail(401, {
      form: semesterUpdateForm,
      message: 'Invalid form data',
      error: Object.entries(semesterUpdateForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const document = await SemesterDatastore.update(semesterUpdateForm.data.id, semesterUpdateForm.data);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: semesterUpdateForm,
      message: document.response.message,
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: semesterUpdateForm,
    ...message(semesterUpdateForm, 'Semester update successful'),
  };
}
