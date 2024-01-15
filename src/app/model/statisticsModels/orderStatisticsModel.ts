export interface IOrderStatistics {
    orderNumber: number,
    tableNumber: number,
    dishes: number,
    drinks: number,
    clients: number,
  
    creationWaiter: string,
    preparationCook?: string| null,
    preparationDrink?: string | null,
    serveWaiter?: string | null
  }