export interface ReservationEquipment {
  id?: number;
  reservationId: number;
  equipmentId?: number;
  equipmentItemId?: number;
  returned?: boolean;
  mishandled?: boolean;
  mishandleType?: MishandleType;
  mishandleDescription?: string;
  rating?: number;
  comment?: string;
  adminNote?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum MishandleType {
  MINOR_DAMAGE = "minor_damage",
  NON_FUNCTIONAL = "non_functional",
  LOST = "lost",
  OTHER = "other"
}
