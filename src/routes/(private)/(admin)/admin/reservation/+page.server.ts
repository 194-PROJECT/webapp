import type { Actions, PageServerLoad, PageServerLoadEvent } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { ReservationDatastore } from '$datastores/reservation/reservation.svelte';
import type { RequestEvent } from './$types';
import { deleteModelSchema, getModelSchema } from '$core/helpers/request';
import { fail } from '@sveltejs/kit';
import { UserDatastore } from '$datastores/user/user.svelte';
import { Operator } from '$core/backend/request.type';
import { ReservationTransformer } from '$datastores/reservation/reservation.transformer';
import { z as validation } from 'zod';

const acceptReservationSchema = validation.object({
  id: validation.number().int().positive(),
  accepted: validation.boolean().default(false),
});

const editReservationSchema = validation.object({
  id: validation.number().int().positive(),
  adminId: validation.number().int().optional(),
  startDate: validation.date(),
  endDate: validation.date(),
  accepted: validation.boolean().optional(),
  returned: validation.boolean().optional(),
  reason: validation.string().optional(),
  adminNote: validation.string().optional(),
  returnNote: validation.string().optional(),
  returnDate: validation.date().optional(),
});

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
	const reservationGetPageForm = await superValidate(event.url.searchParams, zod(getModelSchema));

  if (!reservationGetPageForm.valid) {
    return {
      form: reservationGetPageForm,
      error: 'Invalid form data'
    };
  }

	const reservationCollection = await ReservationDatastore.get({
    field: reservationGetPageForm.data.field,
    operator: reservationGetPageForm.data.operator,
    value: reservationGetPageForm.data.value,
		page: Number(reservationGetPageForm.data.pageIndex),
		page_size: Number(reservationGetPageForm.data.pageSize)
	});

  const userCollection = await UserDatastore.get({
    field: 'id',
    operator: Operator.IN,
    value: reservationCollection.value?.map((reservation) => reservation.userId),
  });

  const reservationUsers = ReservationTransformer.transformReservationUsers(
		reservationCollection.value ?? [],
		userCollection.value ?? []
	);

	return {
		form: reservationGetPageForm,
    reservationUsers: reservationUsers,
    rowCount: reservationCollection.totalRows ?? 0,
	};
};

/**
 * Actions for handling form submissions.
 */
export const actions: Actions = {
  getPageData,
  deleteReservation,
  approveReservation,
  updateReservation,
};

/**
 * Fetches the data for the reservation page.
 * @param event The request event.
 * @returns The reservation page data.
 */
async function getPageData(event: RequestEvent) {
  const request = await event.request.json();
	const reservationGetPageForm = await superValidate(request, zod(getModelSchema));

	if (!reservationGetPageForm.valid) {
		return fail(401, {
      form: reservationGetPageForm,
      error: 'Invalid form data',
    });
	}

  const url = `${event.url.pathname}?${new URLSearchParams(reservationGetPageForm.data).toString()}`;

  return {
    success: true,
    redirect: url,
    ...message(reservationGetPageForm, 'reservation page data fetch successful')
  };
}

async function approveReservation(event: RequestEvent) {
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
}

async function updateReservation(event: RequestEvent) {
  const reservationEditForm = await superValidate(event, zod(editReservationSchema));

  if (!reservationEditForm.valid) {
    return fail(401, {
      form: reservationEditForm,
      message: 'Invalid form data',
      error: Object.entries(reservationEditForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  const adminId = event.locals.user?.id;

  if (!adminId) {
    return fail(401, {
      form: reservationEditForm,
      message: 'Unauthorized',
      error: 'Unauthorized',
    });
  }

  reservationEditForm.data.adminId = adminId;

  const document = await ReservationDatastore.update(reservationEditForm.data.id, reservationEditForm.data);

  if (document.response?.status && document.response.status >= 400) {
    console.error(document.response);
    return fail(document.response.status, {
      form: reservationEditForm,
      message: document.response.message,
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: reservationEditForm,
    ...message(reservationEditForm, 'Reservation update successful')
  };
}

async function deleteReservation(event: RequestEvent) {
  const request = await event.request.json();
  const reservationDeleteForm = await superValidate(request, zod(deleteModelSchema));

  if (!reservationDeleteForm.valid) {
    return fail(401, {
      form: reservationDeleteForm,
      message: 'Invalid form data',
      error: 'Invalid form data',
    });
  }

  const document = await ReservationDatastore.remove(reservationDeleteForm.data.id);

  if (document.response?.status && document.response.status >= 400) {
    return fail(document.response.status, {
      form: reservationDeleteForm,
      message: 'Reservation delete failed',
      error: document.response.message
    });
  }

  return {
    success: true,
    form: reservationDeleteForm,
    ...message(reservationDeleteForm, 'Reservation delete successful')
  };
}
