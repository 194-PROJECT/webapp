import { Operator } from '$core/backend/request.type';
import { ReservationDatastore } from '$datastores/reservation/reservation.svelte';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // Example: Fetch user-specific reservations from the database
  const userId = locals.user.id;

  const madeReservationCollection = await ReservationDatastore.get({
    field: 'user_id',
    operator: Operator.EQUALS,
    value: userId,
  });

  const handledReservationCollection = await ReservationDatastore.get({
    field: 'admin_id',
    operator: Operator.EQUALS,
    value: userId,
  });

  return {
    reservations: madeReservationCollection.value ?? [],
  }
};
