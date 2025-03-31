import { Datastore } from "$core/datastore/datastore.svelte";
import type { Reservation } from "$datastores/reservation/reservation.type";
import { EquipmentReservationBackend } from "./equipment-reservation-backend";

export const EquipmentReservationDatastore = new Datastore<Reservation>(new EquipmentReservationBackend());