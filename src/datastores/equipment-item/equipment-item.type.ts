export interface EquipmentItem {
  id: number;
  itemCode: string;
  equipmentId: number;
  available: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
