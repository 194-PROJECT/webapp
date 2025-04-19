import type { EquipmentItem } from "$datastores/equipment-item/equipment-item.type";
import type { Equipment } from "$datastores/equipment/equipment.type";
import type { Reservation } from "$datastores/reservation/reservation.type";

export interface ReservationEquipment {
  id?: number;
  reservationId: number;
  equipmentId?: number;
  equipmentItemId?: number;
  returned?: boolean;
  mishandled?: boolean;
  mishandleType?: MishandleType;
  mishandleDescription?: string;
  dataRequested?: boolean;
  dataReceived?: boolean;
  dataRequestDescription?: string;
  dataRequestDate?: Date;
  rating?: number;
  comment?: string;
  adminNote?: string;
  createdAt?: Date;
  updatedAt?: Date;
  reservation?: Reservation;
  equipment?: Equipment;
  equipmentItem?: EquipmentItem;
}

export enum MishandleType {
  MINOR_DAMAGE = "minor_damage",
  NON_FUNCTIONAL = "non_functional",
  LOST = "lost",
  OTHER = "other"
}
