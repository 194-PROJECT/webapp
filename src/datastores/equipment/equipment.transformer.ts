import type { EquipmentGetResponse } from "./equipment-backend.type";
import type { Equipment } from "./equipment.type";
import type { Response } from "$core/backend/response.type";
import { EquipmentItemTransformer } from "$datastores/equipment-item/equipment-item.transformer";
import { EquipmentImageTransformer } from "$datastores/equipment-image/equipment-image.transformer";

export class EquipmentTransformer {
  static transform(data: EquipmentGetResponse): Equipment {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      category: data.category,
      quantity: data.quantity,
      purchaseDate: new Date(data.purchase_date),
      purchasedBy: data.purchased_by,
      price: data.price,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      items: data.equipment_items ? data.equipment_items.map((item) => {
        return EquipmentItemTransformer.transform(item);
      }) : undefined,
      images: data.equipment_images ? data.equipment_images.map((image) => {
        return EquipmentImageTransformer.transform(image);
      }) : undefined,
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
