import { ReservationDatastore } from '$datastores/reservation/reservation.svelte';
import { error, type Action, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ReservationEquipmentDatastore } from '$datastores/reservation-equipment/reservation-equipment.svelte';
import { Operator } from '$core/backend/request.type';
import { EquipmentDatastore } from '$datastores/equipment/equipment.svelte';
import { UserDatastore } from '$datastores/user/user.svelte';
import { EquipmentImageDatastore } from '$datastores/equipment-image/equipment-image.svelte';
import type { EquipmentImage } from '$datastores/equipment-image/equipment-image.type';
import type { Collection } from '$core/datastore/collection.svelte';
import { EquipmentItemDatastore } from '$datastores/equipment-item/equipment-item.svelte';
import { z as validation } from 'zod';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

const dataRequestSchema = validation.object({
  id: validation.number().int().positive().default(1),
  dataRequested: validation.boolean(),
  dataRequestDescription: validation.string(),
  dataRequestDate: validation.coerce.date(),
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

  const equipmentItemCollection = await EquipmentItemDatastore.get({
    field: 'id',
    operator: Operator.IN,
    value: reservationEquipmentCollection.value
      ?.map((reservationEquipment) => reservationEquipment.equipmentItemId)
      .filter((id) => id !== undefined),
  });

  const reservationEquipmentDataPromise = reservationEquipmentCollection.value?.map(async (reservationEquipment) => {
    const equipmentItem = equipmentItemCollection.value?.find((item => item.id === reservationEquipment.equipmentItemId));
    const equipment = equipmentCollection.value?.find((item => item.id === reservationEquipment.equipmentId));
    
    let equipmentImageCollection: Collection<EquipmentImage> | undefined;
    if (equipment) {
      equipmentImageCollection = await EquipmentImageDatastore.get({
        ids: [equipment.id],
      });
    }

    return {
      reservationEquipment: reservationEquipment,
      equipmentItem: equipmentItem,
      equipment: equipment,
      equipmentImage: equipmentImageCollection?.value?.length ? equipmentImageCollection.value[0] : undefined,
    };
  });

  const reservationEquipmentData = await Promise.all(reservationEquipmentDataPromise ?? []);
  const reserverDocument = await UserDatastore.get(reservationDocument.value.userId);
  const adminDocument = reservationDocument.value.adminId ?
    await UserDatastore.get(reservationDocument.value.adminId) : undefined;

  return {
    reservation: reservationDocument.value,
    reservationEquipments: reservationEquipmentData,
    reserver: reserverDocument.value,
    admin: adminDocument?.value,
  };
};

const requestEquipmentData: Action = async (event) => {
  const request = await event.request.json();
  const requestEquipmentDataForm = await superValidate(request, zod(dataRequestSchema));

  if (!requestEquipmentDataForm.valid) {
    return fail(401, {
      form: requestEquipmentDataForm,
      message: 'Invalid form data',
      error: Object.entries(requestEquipmentDataForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const document = await ReservationEquipmentDatastore.update(requestEquipmentDataForm.data.id, requestEquipmentDataForm.data);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: requestEquipmentDataForm,
      message: document.response.message,
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: requestEquipmentDataForm,
    ...message(requestEquipmentDataForm, 'Data request sent successfully')
  };
};

export const actions: Actions = {
  requestEquipmentData,
};
