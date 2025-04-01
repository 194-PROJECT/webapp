import { Datastore } from '$core/datastore/datastore.svelte';
import { ReservationBackend } from './reservation-equipment-backend';
import type { ReservationEquipment } from './reservation-equipment.type';

export const ReservationEquipmentDatastore = new Datastore<ReservationEquipment>(
  new ReservationBackend()
);
