import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDish } from 'src/app/model/dishModel';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderDishComponent {
  @Input() dishData!: IDish;

  @Output() plateNumberChange = new EventEmitter<{ plateCount: number, plateNumber: number }>();
  protected plateNumber: number = 0;

  updateNumber(flag: boolean){
    this.plateNumber += flag? 1:-1;
  }

  setNumber(){
    this.plateNumberChange.emit({ plateCount: this.plateNumber, plateNumber: this.dishData.number });
  }


  constructor(

  ){

  }
}
