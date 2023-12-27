export interface IDrink {
    number: number;
    name: string;
    description: string;
    type: number;
    price: number;
  }
  
export enum DrinkType {
  Drink = 1,
  Cocktail = 2,
  Beer = 3,
  Bitter = 4,
  superAlcohol = 5
}