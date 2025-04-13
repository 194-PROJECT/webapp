import { EquipmentDatastore } from '$datastores/equipment/equipment.svelte';
import { error, fail, redirect, type Action, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { z as validation } from "zod";
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { ReservationDatastore } from '$datastores/reservation/reservation.svelte';

const EquipmentRequestSchema = validation.object({
  id: validation.number().int(),
  items: validation.array(validation.number().int().positive()),
});

const reservationCreateSchema = validation.object({
  userId: validation.number(),
  startDate: validation.coerce.date(),
  endDate: validation.coerce.date(),
  reason: validation.string().min(30).max(255),
  equipments: validation.array(EquipmentRequestSchema), // Array of equipment items
});

export const load: PageServerLoad = async ({ locals }) => {
  // Example: Fetch user-specific reservations from the database
  if (!locals.user) {
    throw redirect(302, '/login');
  }

  const equipmentCollection = await EquipmentDatastore.get({
    projection: 'available',
    extra: {
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 7)), // 7 days from now
    }
  });

  return {
    authUser: locals.user,
    equipments: equipmentCollection.value ?? [],
  }
};

const createReservation: Action = async (event) => {
  const request = await event.request.json();
  const reservationCreateForm = await superValidate(request, zod(reservationCreateSchema));

  if (!reservationCreateForm.valid) {
    return fail(401, {
      form: reservationCreateForm,
      message: 'Invalid form data',
      error: Object.entries(reservationCreateForm.errors).flatMap(([key, value]) => {
        return Array.isArray(value) ? value.map((error) => {
          return `${key}: ${error}`;
        }) : `${key}: ${value}`;
      }),
    });
  }

  const document = await ReservationDatastore.push(reservationCreateForm.data);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: reservationCreateForm,
      message: 'Department create failed',
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: reservationCreateForm,
    ...message(reservationCreateForm, 'Department create successful'),
  }
}

export const actions: Actions = {
  createReservation,
};
