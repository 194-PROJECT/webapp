import type { Response } from '$core/backend/response.type';
import { EquipmentItemTransformer } from '$datastores/equipment-item/equipment-item.transformer';
import { EquipmentTransformer } from '$datastores/equipment/equipment.transformer';
import { ReservationTransformer } from '$datastores/reservation/reservation.transformer';
import { UserTransformer } from '$datastores/user/user.transformer';
import type { ReservationEquipmentGetResponse } from './reservation-equipment-backend.type';
import type { ReservationEquipment } from './reservation-equipment.type';

export class ReservationEquipmentTransformer {
  static transform(data: ReservationEquipmentGetResponse): ReservationEquipment {
    return {
      id: data.id,
      reservationId: data.reservation_id,
      equipmentId: data.equipment_id,
      equipmentItemId: data.equipment_item_id,
      returned: data.returned,
      mishandled: data.mishandled,
      mishandleType: data.mishandle_type,
      mishandleDescription: data.mishandle_description,
      dataRequested: data.data_requested,
      dataReceived: data.data_received,
      dataRequestDescription: data.data_request_description,
      dataRequestDate: data.data_request_date ? new Date(data.data_request_date) : undefined,
      rating: data.rating,
      comment: data.comment,
      adminNote: data.admin_note,
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
      reservation: data.reservation ? ReservationTransformer.transform(data.reservation) : undefined,
      equipment: data.equipment ? EquipmentTransformer.transform(data.equipment) : undefined,
      equipmentItem: data.equipment_item ? EquipmentItemTransformer.transform(data.equipment_item) : undefined,
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