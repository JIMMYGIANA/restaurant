export interface IDrink {
    number: number;
    name: string;
    description: string;
    type: number;
    price: number;
    isAlcoholic: boolean;
    productionTime: number;
  }
  
export enum DrinkType {
  Drink = 1,
  Cocktail = 2,
  Beer = 3,
  Bitter = 4,
  SuperAlcohol = 5
}