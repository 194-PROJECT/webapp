import type { Actions, PageServerLoad, PageServerLoadEvent } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z as validation } from 'zod';
import { EquipmentDatastore } from '$datastores/equipment/equipment.svelte';
import type { RequestEvent } from './$types';
import { deleteModelSchema, getModelSchema } from '$core/helpers/request';
import { fail } from '@sveltejs/kit';
import { EquipmentCategory } from '$datastores/equipment/equipment.type';

const equipmentCreateSchema = validation.object({
  name: validation.string().min(2).max(50),
  description: validation.string().max(255).optional(),
  category: validation.string().max(50),
  purchasedBy: validation.string().max(50).optional(),
  purchaseDate: validation.date(),
  price: validation.number().positive(),
});

const equipmentUpdateSchema = validation.object({
  id: validation.number(),
  name: validation.string().min(2).max(50),
  description: validation.string().max(255).optional(),
  category: validation.nativeEnum(EquipmentCategory),
  purchasedBy: validation.string().max(50).optional(),
  purchaseDate: validation.date(),
  price: validation.number().positive(),
});

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
	const equipmentGetPageForm = await superValidate(event.url.searchParams, zod(getModelSchema));

  if (!equipmentGetPageForm.valid) {
    return {
      form: equipmentGetPageForm,
      error: 'Invalid form data'
    };
  }

	const equipmentCollection = await EquipmentDatastore.get({
    field: equipmentGetPageForm.data.field,
    operator: equipmentGetPageForm.data.operator,
    value: equipmentGetPageForm.data.value,
		page: Number(equipmentGetPageForm.data.pageIndex),
		page_size: Number(equipmentGetPageForm.data.pageSize)
	});

	return {
		form: equipmentGetPageForm,
		equipment: equipmentCollection.value ?? [],
    rowCount: equipmentCollection.totalRows ?? 0,
	};
};

export const actions: Actions = {
  getPageData,
  deleteEquipment,
  updateEquipment,
  createEquipment,
};

async function getPageData(event: RequestEvent) {
  const request = await event.request.json();
	const equipmentGetPageForm = await superValidate(request, zod(getModelSchema));

	if (!equipmentGetPageForm.valid) {
		return fail(401, {
      form: equipmentGetPageForm,
      error: 'Invalid form data',
    });
	}

  const url = `${event.url.pathname}?${new URLSearchParams(equipmentGetPageForm.data).toString()}`;

  return {
    success: true,
    redirect: url,
    ...message(equipmentGetPageForm, 'equipment page data fetch successful')
  };
}

async function deleteEquipment(event: RequestEvent) {
  const request = await event.request.json();
  const equipmentDeleteForm = await superValidate(request, zod(deleteModelSchema));

  if (!equipmentDeleteForm.valid) {
    return fail(401, {
      form: equipmentDeleteForm,
      message: 'Invalid form data',
      error: 'Invalid form data',
    });
  }

  const document = await EquipmentDatastore.remove(equipmentDeleteForm.data.id);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: equipmentDeleteForm,
      message: 'equipment delete failed',
      error: document.response.message
    });
  }

  return {
    success: true,
    form: equipmentDeleteForm,
    ...message(equipmentDeleteForm, 'equipment delete successful')
  };
}

async function createEquipment(event: RequestEvent) {
  const equipmentCreateForm = await superValidate(event, zod(equipmentCreateSchema));

  if (!equipmentCreateForm.valid) {
    return fail(401, {
      form: equipmentCreateForm,
      message: 'Invalid form data',
      error: Object.entries(equipmentCreateForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const document = await EquipmentDatastore.push(equipmentCreateForm.data);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: equipmentCreateForm,
      message: 'equipment create failed',
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: equipmentCreateForm,
    ...message(equipmentCreateForm, 'equipment create successful')
  };
}

async function updateEquipment(event: RequestEvent) {
  const equipmentUpdateForm = await superValidate(event, zod(equipmentUpdateSchema));

  if (!equipmentUpdateForm.valid) {
    return fail(401, {
      form: equipmentUpdateForm,
      message: 'Invalid form data',
      error: Object.entries(equipmentUpdateForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const document = await EquipmentDatastore.update(equipmentUpdateForm.data.id, equipmentUpdateForm.data);

  if (document.response?.status && document.response.status >= 400) {
    console.error(document.response);
    return fail(document.response.status, {
      form: equipmentUpdateForm,
      message: document.response.message,
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: equipmentUpdateForm,
    equipment: document.value,
    ...message(equipmentUpdateForm, 'equipment update successful')
  };
}
