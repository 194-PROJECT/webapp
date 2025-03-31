import { EquipmentDatastore } from "$datastores/equipment/equipment.svelte";
import { error } from "@sveltejs/kit";
import type { PageServerLoadEvent } from "./$types";
import type { PageServerLoad } from "./$types";
import { EquipmentReservationDatastore } from "$datastores/equipment-reservation/equipment-reservation.svelte";
import { EquipmentImageDatastore } from "$datastores/equipment-image/equipment-image.svelte";
import { UserDatastore } from "$datastores/user/user.svelte";
import { ReservationTransformer } from "$datastores/reservation/reservation-transformer";
import { Operator } from "$core/backend/request.type";

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
  const equipmentId = Number(event.params.equipmentId);
  const equipmentDocument = await EquipmentDatastore.get(equipmentId);

  if (equipmentDocument.response?.errors) {
    error(
      500,
      `Error loading equipment: ${equipmentDocument.response?.errors[0] ?? "Unknown error"}`
    )
  }

  if (!equipmentDocument.value) {
    throw error(404, "Equipment not found");
  }

  const reservationCollection = await EquipmentReservationDatastore.get({
    ids: [equipmentId],
  });

  const equipmentImageCollection = await EquipmentImageDatastore.get({
    ids: [equipmentId],
  });

  const userCollection = await UserDatastore.get({
      field: 'id',
      operator: Operator.IN,
      value: reservationCollection.value?.map((reservation) => reservation.userId),
  });

  return {
    equipment: equipmentDocument.value,
    images: equipmentImageCollection.value ?? [],
    reservations: reservationCollection.value ?? [],
    users: userCollection.value ?? [],
  };
};
