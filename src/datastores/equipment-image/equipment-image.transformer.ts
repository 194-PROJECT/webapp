import type { EquipmentImageGetResponse } from "./equipment-image-backend.type";
import type { EquipmentImage } from "./equipment-image.type";
import type { Response } from "$core/backend/response.type";

export class EquipmentImageTransformer {
	static transform(data: EquipmentImageGetResponse): EquipmentImage {
		return {
			id: data.id,
			equipmentId: data.equipment_id,
			imageUrl: data.image_url,
			createdAt: new Date(data.created_at),
			updatedAt: new Date(data.updated_at),
		};
	}

	static transformGetResponse(
		response: Response<EquipmentImageGetResponse>
	): Response<EquipmentImage> {
		return {
			...response,
			data: response.data ? EquipmentImageTransformer.transform(response.data) : undefined,
		};
	}

	static transformGetManyResponse(
		response: Response<EquipmentImageGetResponse[]>
	): Response<EquipmentImage[]> {
		return {
			...response,
			data: response.data?.map((data) => EquipmentImageTransformer.transform(data)),
		};
	}
}
