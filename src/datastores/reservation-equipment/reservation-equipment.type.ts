export interface ReservationEquipment {
  id?: number;
  reservationId: number;
  equipmentId?: number;
  equipmentItemId?: number;
  returned?: boolean;
  mishandled?: boolean;
  rating?: number;
  comment?: string;
  adminNote?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
