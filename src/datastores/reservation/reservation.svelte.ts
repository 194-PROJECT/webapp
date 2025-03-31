import { Datastore } from '$core/datastore/datastore.svelte';
import { ReservationBackend } from './reservation-backend';
import type { Reservation } from './reservation.type';

export const ReservationDatastore = new Datastore<Reservation>(new ReservationBackend());
