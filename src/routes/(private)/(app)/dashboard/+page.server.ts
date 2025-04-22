import { Operator } from "$core/backend/request.type";
import { API_BASE_URL } from "$core/protocols/http-client";
import type { BarGraphData } from "$datastores/analytics/analytics.type";
import { ReservationDatastore } from "$datastores/reservation/reservation.svelte";
import { UserDatastore } from "$datastores/user/user.svelte";
import type { PageServerLoadEvent } from "./$types";

export const load = async (event: PageServerLoadEvent) => {
  const userCountResponse = await fetch(`${API_BASE_URL}/user/count`, {
    method: 'GET',
  });
  const equipmentCountResponse = await fetch(`${API_BASE_URL}/equipment/count`, {
    method: 'GET',
  });
  const reservationCountResponse = await fetch(`${API_BASE_URL}/reservation/count`, {
    method: 'GET',
  });
  const equipmentItemCountResponse = await fetch(`${API_BASE_URL}/equipment/item/count?field=available&operator=${Operator.EQUALS}&value=true`, {
    method: `GET`,
  });
  const reservationMadePerMonthResponse = await fetch(`${API_BASE_URL}/analytics/reservation/count/month`, {
    method: 'GET',
  });

  const userCountData = await userCountResponse.json();
  const equipmentCountData = await equipmentCountResponse.json();
  const reservationCountData = await reservationCountResponse.json();
  const equipmentItemCountData = await equipmentItemCountResponse.json();
  const reservationMadePerMonthData = await reservationMadePerMonthResponse.json();

  const recentReservationCollection = await ReservationDatastore.get({
    order_by: 'id',
    order_direction: 'DESC',
    limit: 5,
  });

  const userCollection = await UserDatastore.get({
    field: 'id',
    operator: Operator.IN,
    value: recentReservationCollection.value?.map((reservation) => reservation.userId),
  });

  const recentReservations = recentReservationCollection.value?.map((reservation) => {
    const user = userCollection.value?.find((user) => user.id === reservation.userId);
    return {
      ...reservation,
      user: user,
    };
  });

  return {
    userCount: Number(userCountData.data),
    equipmentCount: Number(equipmentCountData.data),
    reservationCount: Number(reservationCountData.data),
    equipmentItemCount: Number(equipmentItemCountData.data),
    reservationMadePerMonth: reservationMadePerMonthData.data as BarGraphData[],
    recentReservations: recentReservations ?? [],
  }
};
