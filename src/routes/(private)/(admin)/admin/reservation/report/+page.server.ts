import { Operator } from "$core/backend/request.type";
import { API_BASE_URL } from "$core/protocols/http-client";
import type { BarGraphData } from "$datastores/analytics/analytics.type";
import { ReservationDatastore } from "$datastores/reservation/reservation.svelte";
import { UserDatastore } from "$datastores/user/user.svelte";
import type { PageServerLoadEvent } from "./$types";

export const load = async (event: PageServerLoadEvent) => {
  const reservationMadePerMonthResponse = await fetch(`${API_BASE_URL}/analytics/reservation/count/month`);
  const reservationMadePerDayResponse = await fetch(`${API_BASE_URL}/analytics/reservation/count/day`);
  const reservationAverageDurationResponse = await fetch(`${API_BASE_URL}/analytics/reservation/average/duration`);
  const reservationLeadTimeDistributionResponse = await fetch(`${API_BASE_URL}/analytics/reservation/distribution/lead-time`);
  const reservationReturnDelayDistributionResponse = await fetch(`${API_BASE_URL}/analytics/reservation/distribution/return-delay`);
  const reservationMadePerMonthData = await reservationMadePerMonthResponse.json();
  const reservationMadePerDayData = await reservationMadePerDayResponse.json();
  const reservationAverageDurationData = await reservationAverageDurationResponse.json();
  const reservationLeadTimeDistributionData = await reservationLeadTimeDistributionResponse.json();
  const reservationReturnDelayDistributionData = await reservationReturnDelayDistributionResponse.json();

  return {
    reservationMadePerMonth: reservationMadePerMonthData.data as BarGraphData[],
    reservationMadePerDay: reservationMadePerDayData.data as BarGraphData[],
    reservationAverageDuration: reservationAverageDurationData.data as BarGraphData[],
    reservationLeadTimeDistribution: reservationLeadTimeDistributionData.data as BarGraphData[],
    reservationReturnDelayDistribution: reservationReturnDelayDistributionData.data as BarGraphData[],
  }
};
