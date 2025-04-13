import type { Reservation } from './reservation.type';

export const getReservationStatus = (reservation: Reservation): string => {
  if (reservation.accepted === true && reservation.claimed === true && reservation.returned === true && reservation.endDate < new Date()) {
    return 'finished';
  } else if (reservation.accepted === true && reservation.claimed === true && !reservation.returned && reservation.endDate < new Date()) {
    return 'ongoing';
  } else if (reservation.accepted === true && reservation.claimed === true && !reservation.returned && reservation.endDate > new Date()) {
    return 'to return';
  } else if (reservation.accepted === true && !reservation.claimed && !reservation.returned && reservation.endDate < new Date()) {
    return 'not claimed';
  } else if (reservation.accepted === true && !reservation.claimed && !reservation.returned && reservation.startDate < new Date()) {
    return 'to claim';
  } else if (reservation.accepted === true && !reservation.claimed && !reservation.returned && reservation.startDate > new Date()) {
    return 'accepted';
  } else if (reservation.accepted === false && !reservation.claimed && !reservation.returned && reservation.endDate > new Date()) {
    return 'rejected';
  } else if (reservation.accepted === undefined) {
    return 'pending';
  } else if (reservation.endDate < new Date()) {
    return 'lapsed';
  } else {
    return 'unknown';
  }
};

export const isReservationFinished = (reservation: Reservation): boolean => {
  return reservation.accepted === true
    && reservation.returned === true
    && reservation.claimed === true;
};

export const isReservationOngoing = (reservation: Reservation): boolean => {
  return reservation.accepted === true
  && !reservation.returned
  && reservation.claimed === true;
}

export const isReservationPending = (reservation: Reservation): boolean => {
  console.log('isReservationPending', reservation);
  return reservation.accepted === undefined
    && !reservation.returned
    && !reservation.claimed
    && reservation.endDate > new Date();
}

export const isReservationLapsed = (reservation: Reservation): boolean => {
  return !!reservation.claimed
    && reservation.endDate < new Date();
}

export const canApproveReservation = (reservation: Reservation): boolean => {
  return !!reservation.accepted
    && !isReservationFinished(reservation)
    && !isReservationOngoing(reservation) 
    && reservation.endDate > new Date(); 
}
