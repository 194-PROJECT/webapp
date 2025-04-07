import type { Actions, PageServerLoad, PageServerLoadEvent } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z as validation } from 'zod';
import type { RequestEvent } from './$types';
import { deleteModelSchema, getModelSchema } from '$core/helpers/request';
import { fail } from '@sveltejs/kit';
import { Operator } from '$core/backend/request.type';
import { ProgramDatastore } from '$datastores/program/program.svelte';
import { DepartmentDatastore } from '$datastores/department/department.svelte';

const programCreateSchema = validation.object({
  title: validation.string().min(1).max(100),
  description: validation.string().optional(),
  departmentId: validation.number(),
  creditsRequired: validation.number().min(1),
  duration: validation.number().min(1),
});

const programUpdateSchema = validation.object({
  id: validation.number(),
  title: validation.string().min(1).max(100),
  description: validation.string().optional(),
  departmentId: validation.number(),
  creditsRequired: validation.number().min(1),
  duration: validation.number().min(1),
});

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
  const programGetPageForm = await superValidate(event.url.searchParams, zod(getModelSchema));

  if (!programGetPageForm.valid) {
    return {
      form: programGetPageForm,
      error: 'Invalid form data'
    };
  }

  const programCollection = await ProgramDatastore.get({
    field: programGetPageForm.data.field,
    operator: programGetPageForm.data.operator,
    value: programGetPageForm.data.value,
    page: Number(programGetPageForm.data.pageIndex),
    page_size: Number(programGetPageForm.data.pageSize)
  });

  const departmentCollection = await DepartmentDatastore.get({
    field: 'id',
    operator: Operator.IN,
    value: programCollection.value?.map((program) => program.departmentId).filter(
      (value) => value !== undefined
    ),
  });

  const data = programCollection.value?.map((program) => {
    return {
      program: program,
      department: departmentCollection.value?.find((department) => department.id === program.departmentId),
    }
  });

  return {
    form: programGetPageForm,
    programData: data ?? [],
    rowCount: programCollection.totalRows ?? 0,
  };
};

/**
 * Actions for handling form submissions related to groups.
 */
export const actions: Actions = {
  getPageData,
  deleteProgram,
  updateProgram,
  createProgram,
};

/**
 * Fetches the data for the program page.
 * @param event The request event.
 * @returns The program page data.
 */
async function getPageData(event: RequestEvent) {
  const request = await event.request.json();
  const programGetPageForm = await superValidate(request, zod(getModelSchema));

  if (!programGetPageForm.valid) {
    return fail(401, {
      form: programGetPageForm,
      error: 'Invalid form data',
    });
  }

  const url = `${event.url.pathname}?${new URLSearchParams(programGetPageForm.data).toString()}`;

  return {
    success: true,
    redirect: url,
    ...message(programGetPageForm, 'Program page data fetch successful'),
  };
}

/**
 * Deletes a program from the database.
 * @param event
 * @returns
 */
async function deleteProgram(event: RequestEvent) {
  const request = await event.request.json();
  const programDeleteForm = await superValidate(request, zod(deleteModelSchema));

  if (!programDeleteForm.valid) {
    return fail(401, {
      form: programDeleteForm,
      message: 'Invalid form data',
      error: 'Invalid form data',
    });
  }

  const document = await ProgramDatastore.remove(programDeleteForm.data.id);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: programDeleteForm,
      message: 'Program delete failed',
      error: document.response.message,
    });
  }

  return {
    success: true,
    form: programDeleteForm,
    ...message(programDeleteForm, 'Program delete successful'),
  };
}

/**
 * Creates a new program in the database.
 * @param event
 * @returns
 */
async function createProgram(event: RequestEvent) {
  const programCreateForm = await superValidate(event, zod(programCreateSchema));

  if (!programCreateForm.valid) {
    return fail(401, {
      form: programCreateForm,
      message: 'Invalid form data',
      error: Object.entries(programCreateForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const document = await ProgramDatastore.push(programCreateForm.data);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: programCreateForm,
      message: 'Program create failed',
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: programCreateForm,
    ...message(programCreateForm, 'Program create successful'),
  };
}

/**
 * Updates a program in the database.
 * @param event
 * @returns
 */
async function updateProgram(event: RequestEvent) {
  const programUpdateForm = await superValidate(event, zod(programUpdateSchema));

  if (!programUpdateForm.valid) {
    return fail(401, {
      form: programUpdateForm,
      message: 'Invalid form data',
      error: Object.entries(programUpdateForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const document = await ProgramDatastore.update(programUpdateForm.data.id, programUpdateForm.data);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: programUpdateForm,
      message: document.response.message,
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: programUpdateForm,
    ...message(programUpdateForm, 'Program update successful'),
  };
}
