import { ReservationDatastore } from '$datastores/reservation/reservation.svelte';
import { error, type Action, type Actions } from '@sveltejs/kit';
import type { PageServerLoad, RequestEvent } from './$types';
import { ReservationEquipmentDatastore } from '$datastores/reservation-equipment/reservation-equipment.svelte';
import { Operator } from '$core/backend/request.type';
import { EquipmentDatastore } from '$datastores/equipment/equipment.svelte';
import { UserDatastore } from '$datastores/user/user.svelte';
import { EquipmentImageDatastore } from '$datastores/equipment-image/equipment-image.svelte';
import type { EquipmentImage } from '$datastores/equipment-image/equipment-image.type';
import { message, superValidate } from 'sveltekit-superforms';
import { z as validation } from 'zod';
import { fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import type { Collection } from '$core/datastore/collection.svelte';
import { EquipmentItemDatastore } from '$datastores/equipment-item/equipment-item.svelte';
import { deleteModelSchema } from '$core/helpers/request';

const acceptReservationSchema = validation.object({
  id: validation.number().int().positive(),
  adminId: validation.number().int().optional(),
  accepted: validation.boolean().default(false),
});

const claimedReservationSchema = validation.object({
  id: validation.number().int().positive(),
  claimed: validation.boolean().default(false),
});

const reservationEquipmentSchema = validation.object({
  id: validation.number().int().positive().default(1),
  reservationId: validation.number().int().positive().optional(),
  equipmentId: validation.number().int().positive().optional(),
  equipmentItemId: validation.number().int().positive().optional(),
  returned: validation.boolean().optional(),
  mishandled: validation.boolean().optional(),
  adminNote: validation.string().optional(),
});

const reservationEquipmentCreateSchema = validation.object({
  reservationId: validation.number().int().positive(),
  equipmentId: validation.number().int().positive(),
  equipmentItemId: validation.number().int().positive(),
  adminNote: validation.string().optional(),
});

export const load: PageServerLoad = async (event) => {
  const reservationId = Number(event.params.reservationId);
  const reservationDocument = await ReservationDatastore.get(reservationId);

  if (reservationDocument.response?.errors) {
		throw error(
			500,
			`Error loading reservation: ${reservationDocument.response?.errors[0] ?? 'Unknown error'}`
		);
	}

  if (!reservationDocument.value) {
    throw error(404, 'Reservation not found');
  }

  const reservationEquipmentCollection = await ReservationEquipmentDatastore.get({
    ids: [reservationId],
  });

  const equipmentCollection = await EquipmentDatastore.get({
    field: 'id',
    operator: Operator.IN,
    value: reservationEquipmentCollection.value
      ?.map((reservationEquipment) => reservationEquipment.equipmentId)
      .filter((id) => id !== undefined),
  });

  const equipmentItemCollection = await EquipmentItemDatastore.get({
    field: 'id',
    operator: Operator.IN,
    value: reservationEquipmentCollection.value
      ?.map((reservationEquipment) => reservationEquipment.equipmentItemId)
      .filter((id) => id !== undefined),
  });

  const reservationEquipmentDataPromise = reservationEquipmentCollection.value?.map(async (reservationEquipment) => {
    const equipmentItem = equipmentItemCollection.value?.find((item => item.id === reservationEquipment.equipmentItemId));
    const equipment = equipmentCollection.value?.find((item => item.id === reservationEquipment.equipmentId));
    
    let equipmentImageCollection: Collection<EquipmentImage> | undefined;
    if (equipment) {
      equipmentImageCollection = await EquipmentImageDatastore.get({
        ids: [equipment.id],
      });
    }

    return {
      reservationEquipment: reservationEquipment,
      equipmentItem: equipmentItem,
      equipment: equipment,
      equipmentImage: equipmentImageCollection?.value ? equipmentImageCollection.value[0] : undefined,
    };
  });

  const reservationEquipmentData = await Promise.all(reservationEquipmentDataPromise ?? []);
  const reserverDocument = await UserDatastore.get(reservationDocument.value.userId);
  const adminDocument = reservationDocument.value.adminId ?
  await UserDatastore.get(reservationDocument.value.adminId) : undefined;

  return {
    reservation: reservationDocument.value,
    reservationEquipments: reservationEquipmentData,
    reserver: reserverDocument.value,
    admin: adminDocument?.value,
  };
};

const approveReservation: Action = async (event) => {
  const request = await event.request.json();
  const reservationApproveForm = await superValidate(request, zod(acceptReservationSchema));

  if (!reservationApproveForm.valid) {
    return fail(401, {
      form: reservationApproveForm,
      message: 'Invalid form data',
      error: Object.entries(reservationApproveForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const adminId = event.locals.user?.id;

  if (!adminId) {
    return fail(401, {
      form: reservationApproveForm,
      message: 'Unauthorized',
      error: 'Unauthorized',
    });
  }

  reservationApproveForm.data.adminId = adminId;

  const document = await ReservationDatastore.update(reservationApproveForm.data.id, reservationApproveForm.data);
  
  if (document.response?.status && document.response.status >= 400) {
    console.error(document.response);
    return fail(document.response.status, {
      form: reservationApproveForm,
      message: document.response.message,
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: reservationApproveForm,
    ...message(reservationApproveForm, 'Reservation approved')
  };
};

const toggleClaimedReservation: Action = async (event) => {
  const request = await event.request.json();
  const reservationClaimedForm = await superValidate(request, zod(claimedReservationSchema));

  if (!reservationClaimedForm.valid) {
    return fail(401, {
      form: reservationClaimedForm,
      message: 'Invalid form data',
      error: Object.entries(reservationClaimedForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const document = await ReservationDatastore.update(reservationClaimedForm.data.id, reservationClaimedForm.data);

  if (document.response?.status && document.response.status >= 400) {
    console.error(document.response);
    return fail(document.response.status, {
      form: reservationClaimedForm,
      message: document.response.message,
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: reservationClaimedForm,
    ...message(reservationClaimedForm, 'Reservation approved')
  };
};

const deleteReservationEquipment: Action = async (event) => {
  const request = await event.request.json();
  const reservationEquipmentDeleteForm = await superValidate(request, zod(deleteModelSchema));

  if (!reservationEquipmentDeleteForm.valid) {
    return fail(401, {
      form: reservationEquipmentDeleteForm,
      message: 'Invalid form data',
      error: Object.entries(reservationEquipmentDeleteForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const document = await ReservationEquipmentDatastore.remove(reservationEquipmentDeleteForm.data.id);
  
  if (document.response?.status && document.response.status >= 400) {
    console.error(document.response);
    return fail(document.response.status, {
      message: 'Error deleting reservation equipment',
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: reservationEquipmentDeleteForm,
    ...message(reservationEquipmentDeleteForm, 'Reservation equipment deleted')
  };
};

const updateReservationEquipment: Action = async (event) => {
  const request = await event.request.json();
  const reservationEquipmentUpdateForm = await superValidate(request, zod(reservationEquipmentSchema));

  if (!reservationEquipmentUpdateForm.valid) {
    return fail(401, {
      form: reservationEquipmentUpdateForm,
      message: 'Invalid form data',
      error: Object.entries(reservationEquipmentUpdateForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const document = await ReservationEquipmentDatastore.update(reservationEquipmentUpdateForm.data.id, reservationEquipmentUpdateForm.data);
  
  if (document.response?.status && document.response.status >= 400) {
    console.error(document.response);
    return fail(document.response.status, {
      form: reservationEquipmentUpdateForm,
      message: document.response.message,
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: reservationEquipmentUpdateForm,
    ...message(reservationEquipmentUpdateForm, 'Reservation equipment updated')
  };
}

const createReservationEquipment: Action = async (event) => {
  const reservationEquipmentCreateForm = await superValidate(event, zod(reservationEquipmentCreateSchema));

  if (!reservationEquipmentCreateForm.valid) {
    return fail(401, {
      form: reservationEquipmentCreateForm,
      message: 'Invalid form data',
      error: Object.entries(reservationEquipmentCreateForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const document = await ReservationEquipmentDatastore.push(reservationEquipmentCreateForm.data);
  
  if (document.response?.status && document.response.status >= 400) {
    console.error(document.response);
    return fail(document.response.status, {
      form: reservationEquipmentCreateForm,
      message: document.response.message,
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: reservationEquipmentCreateForm,
    ...message(reservationEquipmentCreateForm, 'Reservation equipment created')
  };
}

export const actions: Actions = {
  approveReservation,
  toggleClaimedReservation,
  deleteReservationEquipment,
  updateReservationEquipment,
  createReservationEquipment,
};
