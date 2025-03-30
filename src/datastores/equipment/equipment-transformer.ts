import type { EquipmentGetResponse } from "./equipment-backend.type";
import type { Equipment } from "./equipment.type";
import type { Response } from "$core/backend/response.type";

export class EquipmentTransformer {
  static transform(data: EquipmentGetResponse): Equipment {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      category: data.category,
      purchaseDate: new Date(data.purchase_date),
      price: data.price,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  static transformGetResponse(
    response: Response<EquipmentGetResponse>
  ): Response<Equipment> {
    return {
      ...response,
      data: response.data ? EquipmentTransformer.transform(response.data) : undefined,
    };
  }

  static transformGetManyResponse(
    response: Response<EquipmentGetResponse[]>
  ): Response<Equipment[]> {
    return {
      ...response,
      data: response.data?.map((data) => EquipmentTransformer.transform(data)),
    };
  }
}
