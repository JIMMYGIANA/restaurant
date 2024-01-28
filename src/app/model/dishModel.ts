export interface IDish {
    number: number;
    name: string;
    description: string;
    type: number;
    price: number;
  }
  
  export enum DishType {
    Appetizers = 1,
    FirstPlate = 2,
    SecondPlate = 3,
    SidePlate = 4,
    Dessert = 5
  }