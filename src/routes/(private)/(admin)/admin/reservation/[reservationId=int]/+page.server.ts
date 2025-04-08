import { ReservationDatastore } from '$datastores/reservation/reservation.svelte';
import { error, type Action, type Actions } from '@sveltejs/kit';
import type { PageServerLoad, RequestEvent } from './$types';
import { ReservationEquipmentDatastore } from '$datastores/reservation-equipment/reservation-equipment.svelte';
import { Operator } from '$core/backend/request.type';
import { EquipmentDatastore } from '$datastores/equipment/equipment.svelte';
import { UserDatastore } from '$datastores/user/user.svelte';
import { EquipmentImageDatastore } from '$datastores/equipment-image/equipment-image.svelte';
import type { EquipmentImage } from '$datastores/equipment-image/equipment-image.type';
import { message, superValidate } from 'sveltekit-superforms';
import { z as validation } from 'zod';
import { fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';

const acceptReservationSchema = validation.object({
  id: validation.number().int().positive(),
  accepted: validation.boolean().default(false),
});

export const load: PageServerLoad = async (event) => {
  const reservationId = Number(event.params.reservationId);
  const reservationDocument = await ReservationDatastore.get(reservationId);

  if (reservationDocument.response?.errors) {
		throw error(
			500,
			`Error loading reservation: ${reservationDocument.response?.errors[0] ?? 'Unknown error'}`
		);
	}

  if (!reservationDocument.value) {
    throw error(404, 'Reservation not found');
  }

  const reservationEquipmentCollection = await ReservationEquipmentDatastore.get({
    ids: [reservationId],
  });

  const equipmentCollection = await EquipmentDatastore.get({
    field: 'id',
    operator: Operator.IN,
    value: reservationEquipmentCollection.value
      ?.map((reservationEquipment) => reservationEquipment.equipmentId)
      .filter((id) => id !== undefined),
  });

  const equipmentImages: Record<number, EquipmentImage> = {};

  if (equipmentCollection.value) {
    for (const equipment of equipmentCollection.value) {
      const equipmentImage = await EquipmentImageDatastore.get({
        ids: [equipment.id],
      });

      if (equipmentImage.value) {
        equipmentImages[equipment.id] = equipmentImage.value[0];
      }
    }
  }

  const reserverDocument = await UserDatastore.get(reservationDocument.value.userId);
  const adminDocument = await UserDatastore.get(reservationDocument.value.adminId);

  return {
    reservation: reservationDocument.value,
    reservationEquipments: reservationEquipmentCollection.value ?? [],
    equipments: equipmentCollection.value ?? [],
    equipmentImages: equipmentImages,
    reserver: reserverDocument.value,
    admin: adminDocument.value,
  };
};

const approveReservation: Action = async (event) => {
  const request = await event.request.json();
  const reservationApproveForm = await superValidate(request, zod(acceptReservationSchema));

  if (!reservationApproveForm.valid) {
    return fail(401, {
      form: reservationApproveForm,
      message: 'Invalid form data',
      error: Object.entries(reservationApproveForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const document = await ReservationDatastore.update(reservationApproveForm.data.id, reservationApproveForm.data);
  
  if (document.response?.status && document.response.status >= 400) {
    console.error(document.response);
    return fail(document.response.status, {
      form: reservationApproveForm,
      message: document.response.message,
      error: document.response.errors,
    });
  }

  console.log(document.response);

  return {
    success: true,
    form: reservationApproveForm,
    ...message(reservationApproveForm, 'Reservation approved')
  };
}

export const actions: Actions = {
  approveReservation,
}