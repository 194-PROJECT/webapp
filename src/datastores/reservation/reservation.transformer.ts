import type { Response } from '$core/backend/response.type';
import { ClassTransformer } from '$datastores/class/class.transformer';
import { GroupTransformer } from '$datastores/group/group.transformer';
import { UserTransformer } from '$datastores/user/user.transformer';
import type { User } from '$datastores/user/user.type';
import type { ReservationGetResponse } from './reservation-backend.type';
import type { Reservation, ReservationUser } from './reservation.type';

export class ReservationTransformer {
  static transform(data: ReservationGetResponse): Reservation {
    return {
      id: data.id,
      userId: data.user_id,
      adminId: data.admin_id,
      classId: data.class_id,
      groupId: data.group_id,
      startDate: new Date(data.start_date),
      endDate: new Date(data.end_date),
      accepted: data.accepted ?? undefined,
      claimed: data.claimed ?? undefined,
      returned: data.returned ?? undefined,
      reason: data.reason,
      adminNote: data.admin_note,
      returnNote: data.return_note,
      returnDate: data.return_date ? new Date(data.return_date) : undefined,
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
      user: data.user ? UserTransformer.transform(data.user) : undefined,
      admin: data.admin ? UserTransformer.transform(data.admin) : undefined,
      class: data.class_ ? ClassTransformer.transform(data.class_) : undefined,
      group: data.group ? GroupTransformer.transform(data.group) : undefined,
    };
  }

  static transformGetResponse(response: Response<ReservationGetResponse>): Response<Reservation> {
    return {
      ...response,
      data: response.data ? ReservationTransformer.transform(response.data) : undefined,
    };
  }

  static transformGetManyResponse(
    response: Response<ReservationGetResponse[]>
  ): Response<Reservation[]> {
    return {
      ...response,
      data: response.data?.map((data) => ReservationTransformer.transform(data)),
    };
  }

  static transformReservationUser(
    reservationData: Reservation,
    userData: User,
  ): ReservationUser {
    return {
      ...reservationData,
      ...userData,
      id: reservationData.id,
      createdAt: reservationData.createdAt,
      updatedAt: reservationData.updatedAt,
    };
  }

  static transformReservationUsers(
    reservationData: Reservation[],
    userData: User[],
  ): ReservationUser[] {
    return reservationData.map((reservation) => {
      const user = userData.find((user) => user.id === reservation.userId);
      return this.transformReservationUser(reservation, user!);
    });
  }
}
