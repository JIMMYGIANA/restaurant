export interface IOrder {
    number: number,
    table: number,
    orderCreation: Date,
    orderTaken: Date | null,
    orderPrepared: Date | null,
    orderServed: Date | null,
    orderState: number,
    dishes: number[],
    drinks: number[]
  }
  
  enum OrderState {
      Ordered = 1,
      InPreparation = 2,
      Ready = 3,
      Served = 4,
      Payed = 5
  }