export interface ReservationEquipment {
  id?: number;
  reservationId: number;
  equipmentId?: number;
  quantity: number;
  returned?: boolean;
  returnedQuantity?: number;
  mishandled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
