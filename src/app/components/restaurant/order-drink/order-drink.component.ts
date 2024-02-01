import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDrink } from 'src/app/model/drinkModel';

@Component({
  selector: 'app-order-drink',
  templateUrl: './order-drink.component.html',
  styleUrl: './order-drink.component.css'
})
export class OrderDrinkComponent {

  @Input() drinkData!: IDrink;

  @Output() drinkNumberChange = new EventEmitter<{ drinkCount: number, drinkNumber: number }>();
  protected drinkNumber: number = 0;

  updateNumber(flag: boolean){
    this.drinkNumber += flag? 1:-1;
  }

  setNumber(){
    this.drinkNumberChange.emit({ drinkCount: this.drinkNumber, drinkNumber: this.drinkData.number });
  }


  constructor(

  ){

  }
}
