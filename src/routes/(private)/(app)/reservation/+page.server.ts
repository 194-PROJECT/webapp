import { Operator } from '$core/backend/request.type';
import { ReservationDatastore } from '$datastores/reservation/reservation.svelte';
import { fail, redirect, type Action, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { deleteModelSchema } from '$core/helpers/request';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ locals }) => {
  // Example: Fetch user-specific reservations from the database
  if (!locals.user) {
    throw redirect(302, '/login');
  }
  const userId = locals.user.id;

  const madeReservationCollection = await ReservationDatastore.get({
    order_by: 'id',
    order_direction: 'DESC',
    projection: 'user-reservation',
    ids: [userId],
  });

  const handledReservationCollection = await ReservationDatastore.get({
    field: 'admin_id',
    operator: Operator.EQUALS,
    value: userId,
    order_by: 'id',
    order_direction: 'DESC',
  });

  return {
    reservations: madeReservationCollection.value ?? [],
  }
};

/**
 * Deletes a group from the database.
 * @param event
 * @returns
 */
const deleteReservation: Action = async (event) => {
  const request = await event.request.json();
  const reservationDeleteForm = await superValidate(request, zod(deleteModelSchema));

  if (!reservationDeleteForm.valid) {
    return fail(401, {
      form: reservationDeleteForm,
      message: 'Invalid form data',
      error: 'Invalid form data',
    });
  }

  const document = await ReservationDatastore.remove(reservationDeleteForm.data.id);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: reservationDeleteForm,
      message: 'Group delete failed',
      error: document.response.message,
    });
  }

  return {
    success: true,
    form: reservationDeleteForm,
    ...message(reservationDeleteForm, 'Group delete successful'),
  };
}

export const actions: Actions = {
  deleteReservation,
}
