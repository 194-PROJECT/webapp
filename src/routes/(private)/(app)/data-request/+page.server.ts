import type { Actions, PageServerLoad, PageServerLoadEvent } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { getModelSchema } from '$core/helpers/request';
import { fail } from '@sveltejs/kit';
import { z as validation } from 'zod';
import { ReservationEquipmentDatastore } from '$datastores/reservation-equipment/reservation-equipment.svelte';
import type { Action } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
  const user = event.locals.user;

  if (!user) {
    redirect(302, '/login');
  }

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
    projection: 'data-request',
    ids: [user.id],
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

export const actions: Actions = {
  getPageData,
};
