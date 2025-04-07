import type { Actions, PageServerLoad, PageServerLoadEvent } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z as validation } from 'zod';
import type { RequestEvent } from './$types';
import { deleteModelSchema, getModelSchema } from '$core/helpers/request';
import { fail } from '@sveltejs/kit';
import { DepartmentDatastore } from '$datastores/department/department.svelte';

const departmentCreateSchema = validation.object({
  name: validation.string().min(1).max(100),
  description: validation.string().optional(),
});

const departmentUpdateSchema = validation.object({
  id: validation.number(),
  name: validation.string().min(1).max(100),
  description: validation.string().optional(),
});

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
  const departmentGetPageForm = await superValidate(event.url.searchParams, zod(getModelSchema));

  if (!departmentGetPageForm.valid) {
    return {
      form: departmentGetPageForm,
      error: 'Invalid form data'
    };
  }

  const departmentCollection = await DepartmentDatastore.get({
    field: departmentGetPageForm.data.field,
    operator: departmentGetPageForm.data.operator,
    value: departmentGetPageForm.data.value,
    page: Number(departmentGetPageForm.data.pageIndex),
    page_size: Number(departmentGetPageForm.data.pageSize)
  });

  const data = departmentCollection.value?.map((department) => {
    return {
      department: department,
    }
  });

  return {
    form: departmentGetPageForm,
    departmentData: data ?? [],
    rowCount: departmentCollection.totalRows ?? 0,
  };
};

/**
 * Actions for handling form submissions related to departments.
 */
export const actions: Actions = {
  getPageData,
  deleteDepartment,
  updateDepartment,
  createDepartment,
};

/**
 * Fetches the data for the department page.
 * @param event The request event.
 * @returns The department page data.
 */
async function getPageData(event: RequestEvent) {
  const request = await event.request.json();
  const departmentGetPageForm = await superValidate(request, zod(getModelSchema));

  if (!departmentGetPageForm.valid) {
    return fail(401, {
      form: departmentGetPageForm,
      error: 'Invalid form data',
    });
  }

  const url = `${event.url.pathname}?${new URLSearchParams(departmentGetPageForm.data).toString()}`;

  return {
    success: true,
    redirect: url,
    ...message(departmentGetPageForm, 'Department page data fetch successful'),
  };
}

/**
 * Deletes a department from the database.
 * @param event
 * @returns
 */
async function deleteDepartment(event: RequestEvent) {
  const request = await event.request.json();
  const departmentDeleteForm = await superValidate(request, zod(deleteModelSchema));

  if (!departmentDeleteForm.valid) {
    return fail(401, {
      form: departmentDeleteForm,
      message: 'Invalid form data',
      error: 'Invalid form data',
    });
  }

  const document = await DepartmentDatastore.remove(departmentDeleteForm.data.id);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: departmentDeleteForm,
      message: 'Department delete failed',
      error: document.response.message,
    });
  }

  return {
    success: true,
    form: departmentDeleteForm,
    ...message(departmentDeleteForm, 'Department delete successful'),
  };
}

/**
 * Creates a new department in the database.
 * @param event
 * @returns
 */
async function createDepartment(event: RequestEvent) {
  const departmentCreateForm = await superValidate(event, zod(departmentCreateSchema));

  if (!departmentCreateForm.valid) {
    return fail(401, {
      form: departmentCreateForm,
      message: 'Invalid form data',
      error: Object.entries(departmentCreateForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const document = await DepartmentDatastore.push(departmentCreateForm.data);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: departmentCreateForm,
      message: 'Department create failed',
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: departmentCreateForm,
    ...message(departmentCreateForm, 'Department create successful'),
  };
}

/**
 * Updates a department in the database.
 * @param event
 * @returns
 */
async function updateDepartment(event: RequestEvent) {
  const departmentUpdateForm = await superValidate(event, zod(departmentUpdateSchema));

  if (!departmentUpdateForm.valid) {
    return fail(401, {
      form: departmentUpdateForm,
      message: 'Invalid form data',
      error: Object.entries(departmentUpdateForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const document = await DepartmentDatastore.update(departmentUpdateForm.data.id, departmentUpdateForm.data);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: departmentUpdateForm,
      message: document.response.message,
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: departmentUpdateForm,
    ...message(departmentUpdateForm, 'Department update successful'),
  };
}
