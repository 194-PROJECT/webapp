import { Operator } from '$core/backend/request.type';
import { EquipmentDatastore } from '$datastores/equipment/equipment.svelte';
import { ReservationDatastore } from '$datastores/reservation/reservation.svelte';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // Example: Fetch user-specific reservations from the database
  const userId = locals.user.id;


  const equipmentCollection = await EquipmentDatastore.get({
    projection: 'available',
    extra: {
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 7)), // 7 days from now
    }
  });

  return {
    equipments: equipmentCollection.value ?? [],
  }
};
