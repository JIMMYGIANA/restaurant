export interface IOrder {
    number: number,
    table: number,
    orderCreation: Date,
    
    orderTakenCook: Date | null,
    orderPreparedCook: Date | null,

    orderTakenDrink: Date | null,
    orderPreparedDrink: Date | null,

    orderServed: Date | null,
    orderPayed: Date | null,
    
    dishes: number[],
    drinks: number[]
  }
  
 