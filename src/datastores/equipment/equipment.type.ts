export interface Equipment {
  id?: number;
  name: string;
  description?: string;
  category?: string;
  purchaseDate: Date;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}
