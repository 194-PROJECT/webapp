import { ReservationDatastore } from '$datastores/reservation/reservation.svelte';
import { error, type Action, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Operator } from '$core/backend/request.type';
import { UserDatastore } from '$datastores/user/user.svelte';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import AuthService from '$core/auth/auth.service';
import { z as validation } from 'zod';
import { UserType, UserRole } from '$core/auth/auth.type';

const userUpdateSchema = validation.object({
  id: validation.number(),
  email: validation.string().email(),
  username: validation.string().min(3).max(20),
  firstName: validation.string().min(2).max(30),
  lastName: validation.string().min(2).max(30),
  password: validation.string().min(8).max(20).optional(),
  type: validation.nativeEnum(UserType),
  role: validation.nativeEnum(UserRole),
});

export const load: PageServerLoad = async (event) => {
  const userId = Number(event.params.userId);
  const userDocument = await UserDatastore.get(userId);

  if (userDocument.response?.errors) {
    throw error(
      500,
      `Error loading user: ${userDocument.response?.errors[0] ?? 'Unknown error'}`
    );
  }

  if (!userDocument.value) {
    throw error(404, 'User not found');
  }

  const madeReservationCollection = await ReservationDatastore.get({
    projection: 'user-reservation',
    ids: [userId],
  });

  const handledReservationCollection = await ReservationDatastore.get({
    field: 'admin_id',
    operator: Operator.EQUALS,
    value: userId,
  });

  const usersCollection = await UserDatastore.get({
    field: 'id',
    operator: Operator.IN,
    value: handledReservationCollection.value?.map((reservation) => reservation.userId),
  });

  const handledReservations = handledReservationCollection.value?.map((reservation) => {
    const user = usersCollection.value?.find((user) => user.id === reservation.userId);
    return {
      reservation: reservation,
      user: user,
    };
  });

  return {
    user: userDocument.value,
    reservations: madeReservationCollection.value ?? [],
    handledReservations: handledReservations ?? [],
  }
};

const updateUser: Action = async (event) => {
  const userUpdateForm = await superValidate(event, zod(userUpdateSchema));

  if (!userUpdateForm.valid) {
    return fail(401, {
      form: userUpdateForm,
      message: 'Invalid form data',
      error: Object.entries(userUpdateForm.errors).flatMap(([key, value]) => {
        return value.map((error) => `${key}: ${error}`);
      }),
    });
  }

  if(userUpdateForm.data.password) {
    userUpdateForm.data.password = AuthService.encrypt(userUpdateForm.data.password);
  }

  const document = await UserDatastore.update(userUpdateForm.data.id, userUpdateForm.data);

  if (document.response?.status && document.response.status >= 400) {
    console.error(document.response);
    return fail(document.response.status, {
      form: userUpdateForm,
      message: document.response.message,
      error: document.response.errors,
    });
  }

  return {
    success: true,
    form: userUpdateForm,
    user: document.value,
    ...message(userUpdateForm, 'user update successful')
  };
}

export const actions: Actions = {
  updateUser,
}
