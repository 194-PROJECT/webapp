import type { Response } from '$core/backend/response.type';
import type { ReservationEquipmentGetResponse } from './reservation-equipment-backend.type';
import type { ReservationEquipment } from './reservation-equipment.type';

export class ReservationEquipmentTransformer {
  static transform(data: ReservationEquipmentGetResponse): ReservationEquipment {
    return {
      id: data.id,
      reservationId: data.reservation_id,
      equipmentId: data.equipment_id,
      quantity: data.quantity,
      returned: data.returned,
      returnedQuantity: data.returned_quantity,
      mishandled: data.mishandled,
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    };
  }

  static transformGetResponse(response: Response<ReservationEquipmentGetResponse>): Response<ReservationEquipment> {
    return {
      ...response,
      data: response.data ? ReservationEquipmentTransformer.transform(response.data) : undefined,
    };
  }

  static transformGetManyResponse(
    response: Response<ReservationEquipmentGetResponse[]>
  ): Response<ReservationEquipment[]> {
    return {
      ...response,
      data: response.data?.map((data) => ReservationEquipmentTransformer.transform(data)),
    };
  }
}