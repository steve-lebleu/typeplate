export interface IModel {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  whitelist: string[];
}