import type { Actions, PageServerLoad, PageServerLoadEvent } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { ReservationDatastore } from '$datastores/reservation/reservation.svelte';
import type { RequestEvent } from './$types';
import { deleteModelSchema, getModelSchema } from '$core/helpers/request';
import { fail } from '@sveltejs/kit';
import { UserDatastore } from '$datastores/user/user.svelte';
import { Operator } from '$core/backend/request.type';
import { ReservationTransformer } from '$datastores/reservation/reservation.transformer';
import { z as validation } from 'zod';
import { ReservationEquipmentDatastore } from '$datastores/reservation-equipment/reservation-equipment.svelte';
import type { Action } from '@sveltejs/kit';

const toggleMishandleStatusSchema = validation.object({
  id: validation.number().int().positive(),
  mishandled: validation.boolean().default(false),
});

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
	const reservationEquipmentGetPageForm = await superValidate(
		event.url.searchParams,
		zod(getModelSchema)
	);

	if (!reservationEquipmentGetPageForm.valid) {
		return {
			form: reservationEquipmentGetPageForm,
			error: 'Invalid form data'
		};
	}

	const reservationEquipmentCollection = await ReservationEquipmentDatastore.get({
		field: reservationEquipmentGetPageForm.data.field,
		operator: reservationEquipmentGetPageForm.data.operator,
		value: reservationEquipmentGetPageForm.data.value,
		page: Number(reservationEquipmentGetPageForm.data.pageIndex),
		page_size: Number(reservationEquipmentGetPageForm.data.pageSize),
    projection: 'mishandle'
	});

  return {
    form: reservationEquipmentGetPageForm,
    reservationEquipment: reservationEquipmentCollection.value,
    rowCount: reservationEquipmentCollection.totalRows ?? 0,
  }
};

/**
 * Fetches the data for the reservation page.
 * @param event The request event.
 * @returns The reservation page data.
 */
const getPageData: Action = async (event) => {
  const request = await event.request.json();
  const reservationEquipmentGetPageForm = await superValidate(request, zod(getModelSchema));

  if (!reservationEquipmentGetPageForm.valid) {
    return fail(401, {
      form: reservationEquipmentGetPageForm,
      error: 'Invalid form data',
    });
  }

  const url = `${event.url.pathname}?${new URLSearchParams(reservationEquipmentGetPageForm.data).toString()}`;

  return {
    success: true,
    redirect: url,
    ...message(reservationEquipmentGetPageForm, 'reservation page data fetch successful')
  };
}

const toggleMishandleStatus: Action = async (event) => {
  const request = await event.request.json();
  const dataReceivedForm = await superValidate(request, zod(toggleMishandleStatusSchema));

  if (!dataReceivedForm.valid) {
    return fail(401, {
      form: dataReceivedForm,
      message: 'Invalid form data',
      error: Object.entries(dataReceivedForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const document = await ReservationEquipmentDatastore.update(dataReceivedForm.data.id, dataReceivedForm.data);

  if (document.response?.status && document.response.status >= 400) {
    return fail(401, {
      form: dataReceivedForm,
      message: document.response.message,
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: dataReceivedForm,
    ...message(dataReceivedForm, 'Data received status updated successfully'),
  }
}

export const actions: Actions = {
  getPageData,
  toggleMishandleStatus,
};
