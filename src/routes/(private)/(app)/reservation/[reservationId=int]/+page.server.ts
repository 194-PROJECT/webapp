import { ReservationDatastore } from '$datastores/reservation/reservation.svelte';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ReservationEquipmentDatastore } from '$datastores/reservation-equipment/reservation-equipment.svelte';
import { Operator } from '$core/backend/request.type';
import { EquipmentDatastore } from '$datastores/equipment/equipment.svelte';
import { UserDatastore } from '$datastores/user/user.svelte';
import { EquipmentImageDatastore } from '$datastores/equipment-image/equipment-image.svelte';
import type { EquipmentImage } from '$datastores/equipment-image/equipment-image.type';
import type { Collection } from '$core/datastore/collection.svelte';
import { EquipmentItemDatastore } from '$datastores/equipment-item/equipment-item.svelte';

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
