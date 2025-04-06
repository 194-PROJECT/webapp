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
import { GroupDatastore } from '$datastores/group/group.svelte';
import { SemesterDatastore } from '$datastores/semester/semester.svelte';

const groupCreateSchema = validation.object({
  name: validation.string().min(1).max(50),
  description: validation.string().optional(),
  classId: validation.number(),
});

const groupUpdateSchema = validation.object({
  id: validation.number(),
  name: validation.string().min(1).max(50),
  description: validation.string().optional(),
  classId: validation.number(),
});

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
	const groupGetPageForm = await superValidate(event.url.searchParams, zod(getModelSchema));

  if (!groupGetPageForm.valid) {
    return {
      form: groupGetPageForm,
      error: 'Invalid form data'
    };
  }

	const groupCollection = await GroupDatastore.get({
    field: groupGetPageForm.data.field,
    operator: groupGetPageForm.data.operator,
    value: groupGetPageForm.data.value,
		page: Number(groupGetPageForm.data.pageIndex),
		page_size: Number(groupGetPageForm.data.pageSize)
	});

  const classCollection = await ClassDatastore.get({
    field: 'id',
    operator: Operator.IN,
    value: groupCollection.value?.map((group) => group.classId).filter(
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

  const data = groupCollection.value?.map((group) => {
    const class_ = classCollection.value?.find((class_) => class_.id === group.classId);
    const semester = semesterCollection.value?.find((semester) => semester.id === class_?.semesterId);
    const instructor = instructorCollection.value?.find((instructor) => instructor.id === class_?.instructorId);
    return {
      group: group,
      class: class_,
      semester,
      instructor,
    };
  });

	return {
    form: groupGetPageForm,
    groupData: data,
    rowCount: groupCollection.totalRows ?? 0,
	};
};

/**
 * Actions for handling form submissions related to groups.
 */
export const actions: Actions = {
  getPageData,
  deleteGroup,
  updateGroup,
  createGroup,
};

/**
 * Fetches the data for the group page.
 * @param event The request event.
 * @returns The group page data.
 */
async function getPageData(event: RequestEvent) {
  const request = await event.request.json();
  const groupGetPageForm = await superValidate(request, zod(getModelSchema));

  if (!groupGetPageForm.valid) {
    return fail(401, {
      form: groupGetPageForm,
      error: 'Invalid form data',
    });
  }

  const url = `${event.url.pathname}?${new URLSearchParams(groupGetPageForm.data).toString()}`;

  return {
    success: true,
    redirect: url,
    ...message(groupGetPageForm, 'Group page data fetch successful'),
  };
}

/**
 * Deletes a group from the database.
 * @param event
 * @returns
 */
async function deleteGroup(event: RequestEvent) {
  const request = await event.request.json();
  const groupDeleteForm = await superValidate(request, zod(deleteModelSchema));

  if (!groupDeleteForm.valid) {
    return fail(401, {
      form: groupDeleteForm,
      message: 'Invalid form data',
      error: 'Invalid form data',
    });
  }

  const document = await GroupDatastore.remove(groupDeleteForm.data.id);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: groupDeleteForm,
      message: 'Group delete failed',
      error: document.response.message,
    });
  }

  return {
    success: true,
    form: groupDeleteForm,
    ...message(groupDeleteForm, 'Group delete successful'),
  };
}

/**
 * Creates a new group in the database.
 * @param event
 * @returns
 */
async function createGroup(event: RequestEvent) {
  const groupCreateForm = await superValidate(event, zod(groupCreateSchema));

  if (!groupCreateForm.valid) {
    return fail(401, {
      form: groupCreateForm,
      message: 'Invalid form data',
      error: Object.entries(groupCreateForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const document = await GroupDatastore.push(groupCreateForm.data);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: groupCreateForm,
      message: 'Group create failed',
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: groupCreateForm,
    ...message(groupCreateForm, 'Group create successful'),
  };
}

/**
 * Updates a group in the database.
 * @param event
 * @returns
 */
async function updateGroup(event: RequestEvent) {
  const groupUpdateForm = await superValidate(event, zod(groupUpdateSchema));

  if (!groupUpdateForm.valid) {
    return fail(401, {
      form: groupUpdateForm,
      message: 'Invalid form data',
      error: Object.entries(groupUpdateForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const document = await GroupDatastore.update(groupUpdateForm.data.id, groupUpdateForm.data);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: groupUpdateForm,
      message: document.response.message,
      errors: document.response.errors,
    });
  }

  return {
    success: true,
    form: groupUpdateForm,
    ...message(groupUpdateForm, 'Group update successful'),
  };
}