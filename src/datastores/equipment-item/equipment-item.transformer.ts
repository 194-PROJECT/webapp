import type { Response } from '$core/backend/response.type';
import type { EquipmentItemGetResponse } from './equipment-item-backend.type';
import type { EquipmentItem } from './equipment-item.type';

export class EquipmentItemTransformer {
  static transform(data: EquipmentItemGetResponse): EquipmentItem {
    return {
      id: data.id,
      itemCode: data.item_code,
      equipmentId: data.equipment_id,
      available: data.available,
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    };
  }

  static transformGetResponse(response: Response<EquipmentItemGetResponse>): Response<EquipmentItem> {
    return {
      ...response,
      data: response.data ? EquipmentItemTransformer.transform(response.data) : undefined,
    };
  }

  static transformGetManyResponse(response: Response<EquipmentItemGetResponse[]>): Response<EquipmentItem[]> {
    return {
      ...response,
      data: response.data?.map((data) => EquipmentItemTransformer.transform(data)),
    };
  }
}