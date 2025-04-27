import { EquipmentDatastore } from "$datastores/equipment/equipment.svelte";
import { error, fail, type Action, type Actions } from "@sveltejs/kit";
import type { PageServerLoadEvent } from "./$types";
import type { PageServerLoad } from "./$types";
import { EquipmentReservationDatastore } from "$datastores/equipment-reservation/equipment-reservation.svelte";
import { EquipmentImageDatastore } from "$datastores/equipment-image/equipment-image.svelte";
import { UserDatastore } from "$datastores/user/user.svelte";
import { Operator } from "$core/backend/request.type";
import { EquipmentItemDatastore } from "$datastores/equipment-item/equipment-item.svelte";
import { z as validation } from "zod";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { deleteModelSchema } from "$core/helpers/request";

const equipmentItemCreateSchema = validation.object({
  itemCode: validation.string(),
  equipmentId: validation.number(),
  available: validation.boolean(),
});

const equipmentItemUpdateSchema = validation.object({
  id: validation.number(),
  itemCode: validation.string(),
  equipmentId: validation.number(),
  available: validation.boolean(),
});

const equipmentImageAddSchema = validation.object({
  equipmentId: validation.number(),
  imageUrl: validation.string(),
});

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
  const equipmentId = Number(event.params.equipmentId);
  const equipmentDocument = await EquipmentDatastore.get(equipmentId);

  if (equipmentDocument.response?.errors) {
    error(
      500,
      `Error loading equipment: ${equipmentDocument.response?.errors[0] ?? "Unknown error"}`
    )
  }

  if (!equipmentDocument.value) {
    throw error(404, "Equipment not found");
  }

  const reservationCollection = await EquipmentReservationDatastore.get({
    ids: [equipmentId],
    order_by: 'start_date',
    order_direction: 'DESC',
  });

  const equipmentImageCollection = await EquipmentImageDatastore.get({
    ids: [equipmentId],
  });

  const equipmentItemCollection = await EquipmentItemDatastore.get({
    ids: [equipmentId],
  });

  const userCollection = await UserDatastore.get({
    field: 'id',
    operator: Operator.IN,
    value: reservationCollection.value?.map((reservation) => reservation.userId),
  });

  return {
    equipment: equipmentDocument.value,
    equipmentItems: equipmentItemCollection.value ?? [],
    images: equipmentImageCollection.value ?? [],
    reservations: reservationCollection.value ?? [],
    users: userCollection.value ?? [],
  };
};

const deleteEquipmentItem: Action = async (event) => {
  const request = await event.request.json();
  const equipmentItemDeleteForm = await superValidate(request, zod(deleteModelSchema));

  if (!equipmentItemDeleteForm.valid) {
    return fail(401, {
      form: equipmentItemDeleteForm,
      message: 'Invalid form data',
      error: Object.entries(equipmentItemDeleteForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const document = await EquipmentItemDatastore.remove(equipmentItemDeleteForm.data.id);
  
  if (document.response?.status && document.response.status >= 400) {
    console.error(document.response);
    return fail(document.response.status, {
      message: 'Error deleting equipment item',
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: equipmentItemDeleteForm,
    message: 'Equipment item deleted successfully',
  };
};

const updateEquipmentItem: Action = async (event) => {
  const equipmentItemUpdateForm = await superValidate(event, zod(equipmentItemUpdateSchema));

  if (!equipmentItemUpdateForm.valid) {
    return fail(401, {
      form: equipmentItemUpdateForm,
      message: 'Invalid form data',
      error: Object.entries(equipmentItemUpdateForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const document = await EquipmentItemDatastore.update(equipmentItemUpdateForm.data.id, equipmentItemUpdateForm.data);
  
  if (document.response?.status && document.response.status >= 400) {
    console.error(document.response);
    return fail(document.response.status, {
      form: equipmentItemUpdateForm,
      message: document.response.message,
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: equipmentItemUpdateForm,
    message: 'Equipment item updated successfully',
  };
};

const createEquipmentItem: Action = async (event) => {
  const equipmentItemCreateForm = await superValidate(event, zod(equipmentItemCreateSchema));

  if (!equipmentItemCreateForm.valid) {
    return fail(401, {
      form: equipmentItemCreateForm,
      message: 'Invalid form data',
      error: Object.entries(equipmentItemCreateForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const document = await EquipmentItemDatastore.push(equipmentItemCreateForm.data);
  
  if (document.response?.status && document.response.status >= 400) {
    console.error(document.response);
    return fail(document.response.status, {
      form: equipmentItemCreateForm,
      message: document.response.message,
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: equipmentItemCreateForm,
    message: 'Equipment item created successfully',
  };
};

const addEquipmentImage: Action = async (event) => {
  const equipmentImageAddForm = await superValidate(event, zod(equipmentImageAddSchema));

  if (!equipmentImageAddForm.valid) {
    return fail(401, {
      form: equipmentImageAddForm,
      message: 'Invalid form data',
      error: 'Invalid form data',
    });
  }

  const document = await EquipmentImageDatastore.push(equipmentImageAddForm.data);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: equipmentImageAddForm,
      message: 'Failed to add equipment image',
      error: document.response.message,
    });
  }

  return {
    success: true,
    form: equipmentImageAddForm,
    data: document.value,
    message: 'Equipment image added successfully',
  };
};

const deleteEquipmentImage: Action = async (event) => {
  const equipmentImageDeleteForm = await superValidate(event, zod(deleteModelSchema));

  if (!equipmentImageDeleteForm.valid) {
    return fail(401, {
      form: equipmentImageDeleteForm,
      message: 'Invalid form data',
      error: 'Invalid form data',
    });
  }

  const document = await EquipmentImageDatastore.remove(equipmentImageDeleteForm.data.id);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: equipmentImageDeleteForm,
      message: 'Failed to delete equipment image',
      error: document.response.message,
    });
  }

  return {
    success: true,
    form: equipmentImageDeleteForm,
    message: 'Equipment image deleted successfully',
  };
};

export const actions: Actions = {
  createEquipmentItem,
  updateEquipmentItem,
  deleteEquipmentItem,
  addEquipmentImage,
  deleteEquipmentImage,
};