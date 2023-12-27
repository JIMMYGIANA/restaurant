export interface IUser {
  name: string;
  surname: string;
  email: string;
  password: string;
  role: number;
}

export enum UserRole {
  Waiters = 1,
  Cook = 2,
  Bartenders = 3,
  Cashier = 4
}