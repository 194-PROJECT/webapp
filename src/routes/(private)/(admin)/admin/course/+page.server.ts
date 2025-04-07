import type { Actions, PageServerLoad, PageServerLoadEvent } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z as validation } from 'zod';
import type { RequestEvent } from './$types';
import { deleteModelSchema, getModelSchema } from '$core/helpers/request';
import { fail } from '@sveltejs/kit';
import { Operator } from '$core/backend/request.type';
import { ProgramDatastore } from '$datastores/program/program.svelte';
import { CourseDatastore } from '$datastores/course/course.svelte';

const courseCreateSchema = validation.object({
  name: validation.string().min(1).max(100),
  description: validation.string().optional(),
  programId: validation.number(),
  credits: validation.number().min(1).max(10),
});

const courseUpdateSchema = validation.object({
  id: validation.number(),
  name: validation.string().min(1).max(100),
  description: validation.string().optional(),
  programId: validation.number(),
  credits: validation.number().min(1).max(10),
});

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
  const classGetPageForm = await superValidate(event.url.searchParams, zod(getModelSchema));

  if (!classGetPageForm.valid) {
    return {
      form: classGetPageForm,
      error: 'Invalid form data'
    };
  }

  const courseCollection = await CourseDatastore.get({
    field: classGetPageForm.data.field,
    operator: classGetPageForm.data.operator,
    value: classGetPageForm.data.value,
    page: Number(classGetPageForm.data.pageIndex),
    page_size: Number(classGetPageForm.data.pageSize)
  });

  const programCollection = await ProgramDatastore.get({
    field: 'id',
    operator: Operator.IN,
    value: courseCollection.value?.map((course) => course.programId).filter(
      (value) => value !== undefined
    ),
  });

  const data = courseCollection.value?.map((course) => {
    return {
      course: course,
      program: programCollection.value?.find((program) => program.id === course.programId),
    };
  });

  return {
    form: classGetPageForm,
    courseData: data ?? [],
    rowCount: courseCollection.totalRows ?? 0,
  };
};

/**
 * Actions for handling form submissions related to courses.
 */
export const actions: Actions = {
  getPageData,
  deleteCourse,
  updateCourse,
  createCourse,
};

/**
 * Fetches the data for the course page.
 * @param event The request event.
 * @returns The course page data.
 */
async function getPageData(event: RequestEvent) {
  const request = await event.request.json();
  const courseGetPageForm = await superValidate(request, zod(getModelSchema));

  if (!courseGetPageForm.valid) {
    return fail(401, {
      form: courseGetPageForm,
      error: 'Invalid form data',
    });
  }

  const url = `${event.url.pathname}?${new URLSearchParams(courseGetPageForm.data).toString()}`;

  return {
    success: true,
    redirect: url,
    ...message(courseGetPageForm, 'Course page data fetch successful'),
  };
}

/**
 * Deletes a course from the database.
 * @param event
 * @returns
 */
async function deleteCourse(event: RequestEvent) {
  const request = await event.request.json();
  const courseDeleteForm = await superValidate(request, zod(deleteModelSchema));

  if (!courseDeleteForm.valid) {
    return fail(401, {
      form: courseDeleteForm,
      message: 'Invalid form data',
      error: 'Invalid form data',
    });
  }

  const document = await CourseDatastore.remove(courseDeleteForm.data.id);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: courseDeleteForm,
      message: 'Course delete failed',
      error: document.response.message,
    });
  }

  return {
    success: true,
    form: courseDeleteForm,
    ...message(courseDeleteForm, 'Course delete successful'),
  };
}

/**
 * Creates a new course in the database.
 * @param event
 * @returns
 */
async function createCourse(event: RequestEvent) {
  const courseCreateForm = await superValidate(event, zod(courseCreateSchema));

  if (!courseCreateForm.valid) {
    return fail(401, {
      form: courseCreateForm,
      message: 'Invalid form data',
      error: Object.entries(courseCreateForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const document = await CourseDatastore.push(courseCreateForm.data);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: courseCreateForm,
      message: 'Course create failed',
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: courseCreateForm,
    ...message(courseCreateForm, 'Course create successful'),
  };
}

/**
 * Updates a course in the database.
 * @param event
 * @returns
 */
async function updateCourse(event: RequestEvent) {
  const courseUpdateForm = await superValidate(event, zod(courseUpdateSchema));

  if (!courseUpdateForm.valid) {
    return fail(401, {
      form: courseUpdateForm,
      message: 'Invalid form data',
      error: Object.entries(courseUpdateForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const document = await CourseDatastore.update(courseUpdateForm.data.id, courseUpdateForm.data);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: courseUpdateForm,
      message: document.response.message,
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: courseUpdateForm,
    ...message(courseUpdateForm, 'Course update successful'),
  };
}
