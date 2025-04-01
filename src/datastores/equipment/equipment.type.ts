export interface Equipment {
  id: number;
  name: string;
  description: string;
  category: string;
  quantity: number;
  purchaseDate: Date;
  purchasedBy?: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum EquipmentCategory {
  ACCESSORY = "accessory",
  INSTRUMENT = "instrument",
  TOOL = "tool",
}
