import type { Actions, PageServerLoad, PageServerLoadEvent } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z as validation } from 'zod';
import type { RequestEvent } from './$types';
import { deleteModelSchema, getModelSchema } from '$core/helpers/request';
import { fail } from '@sveltejs/kit';
import { UserDatastore } from '$datastores/user/user.svelte';
import { Operator } from '$core/backend/request.type';
import { ClassDatastore } from '$datastores/class/class.svelte';
import { SemesterDatastore } from '$datastores/semester/semester.svelte';
import { CourseDatastore } from '$datastores/course/course.svelte';

const classCreateSchema = validation.object({
  name: validation.string().min(1).max(50),
  description: validation.string().optional(),
  courseId: validation.number(),
  semesterId: validation.number(),
  instructorId: validation.number(),
});

const classUpdateSchema = validation.object({
  id: validation.number(),
  name: validation.string().min(1).max(50),
  description: validation.string().optional(),
  courseId: validation.number(),
  semesterId: validation.number(),
  instructorId: validation.number(),
});

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
  const classGetPageForm = await superValidate(event.url.searchParams, zod(getModelSchema));

  if (!classGetPageForm.valid) {
    return {
      form: classGetPageForm,
      error: 'Invalid form data'
    };
  }

  const classCollection = await ClassDatastore.get({
    field: classGetPageForm.data.field,
    operator: classGetPageForm.data.operator,
    value: classGetPageForm.data.value,
    page: Number(classGetPageForm.data.pageIndex),
    page_size: Number(classGetPageForm.data.pageSize)
  });

  const courseCollection = await CourseDatastore.get({
    field: 'id',
    operator: Operator.IN,
    value: classCollection.value?.map((class_) => class_.courseId).filter(
      (value) => value !== undefined
    ),
  });

  const semesterCollection = await SemesterDatastore.get({
    field: 'id',
    operator: Operator.IN,
    value: classCollection.value?.map((class_) => class_.semesterId).filter(
      (value) => value !== undefined
    ),
  });

  const instructorCollection = await UserDatastore.get({
    field: 'id',
    operator: Operator.IN,
    value: classCollection.value?.map((class_) => class_.instructorId).filter(
      (value) => value !== undefined
    ),
  });

  const data = classCollection.value?.map((class_) => {
    return {
      class: class_,
      course: courseCollection.value?.find((course) => course.id === class_.courseId),
      semester: semesterCollection.value?.find((semester) => semester.id === class_.semesterId),
      instructor: instructorCollection.value?.find((instructor) => instructor.id === class_.instructorId),
    };
  });

  return {
    form: classGetPageForm,
    classData: data ?? [],
    rowCount: classCollection.totalRows ?? 0,
  };
};

/**
 * Actions for handling form submissions related to groups.
 */
export const actions: Actions = {
  getPageData,
  deleteClass,
  updateClass,
  createClass,
};

/**
 * Fetches the data for the class page.
 * @param event The request event.
 * @returns The class page data.
 */
async function getPageData(event: RequestEvent) {
  const request = await event.request.json();
  const classGetPageForm = await superValidate(request, zod(getModelSchema));

  if (!classGetPageForm.valid) {
    return fail(401, {
      form: classGetPageForm,
      error: 'Invalid form data',
    });
  }

  const url = `${event.url.pathname}?${new URLSearchParams(classGetPageForm.data).toString()}`;

  return {
    success: true,
    redirect: url,
    ...message(classGetPageForm, 'Class page data fetch successful'),
  };
}

/**
 * Deletes a class from the database.
 * @param event
 * @returns
 */
async function deleteClass(event: RequestEvent) {
  const request = await event.request.json();
  const classDeleteForm = await superValidate(request, zod(deleteModelSchema));

  if (!classDeleteForm.valid) {
    return fail(401, {
      form: classDeleteForm,
      message: 'Invalid form data',
      error: 'Invalid form data',
    });
  }

  const document = await ClassDatastore.remove(classDeleteForm.data.id);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: classDeleteForm,
      message: 'Class delete failed',
      error: document.response.message,
    });
  }

  return {
    success: true,
    form: classDeleteForm,
    ...message(classDeleteForm, 'Class delete successful'),
  };
}

/**
 * Creates a new class in the database.
 * @param event
 * @returns
 */
async function createClass(event: RequestEvent) {
  const classCreateForm = await superValidate(event, zod(classCreateSchema));

  if (!classCreateForm.valid) {
    return fail(401, {
      form: classCreateForm,
      message: 'Invalid form data',
      error: Object.entries(classCreateForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const document = await ClassDatastore.push(classCreateForm.data);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: classCreateForm,
      message: 'Class create failed',
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: classCreateForm,
    ...message(classCreateForm, 'Class create successful'),
  };
}

/**
 * Updates a class in the database.
 * @param event
 * @returns
 */
async function updateClass(event: RequestEvent) {
  const classUpdateForm = await superValidate(event, zod(classUpdateSchema));

  if (!classUpdateForm.valid) {
    return fail(401, {
      form: classUpdateForm,
      message: 'Invalid form data',
      error: Object.entries(classUpdateForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const document = await ClassDatastore.update(classUpdateForm.data.id, classUpdateForm.data);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: classUpdateForm,
      message: document.response.message,
      errors: document.response.errors,
    });
  }

  return {
    success: true,
    form: classUpdateForm,
    ...message(classUpdateForm, 'Class update successful'),
  };
}
