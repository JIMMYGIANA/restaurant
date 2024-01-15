import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IDish } from 'src/app/model/dishModel';
import { IDrink } from 'src/app/model/drinkModel';
import { BarsService } from 'src/app/services/bars.service';

@Component({
  selector: 'app-drink',
  templateUrl: './drink.component.html',
  styleUrl: './drink.component.css'
})
export class DrinkComponent implements OnInit {
  @Input() drinkNumber!: number;

  protected drinkData: Observable<IDrink> | undefined = undefined;

  constructor(
    private barsService: BarsService
  ){
    
  }

  ngOnInit(): void {
    if (!isNaN(this.drinkNumber)) {
      this.drinkData = this.barsService.getDrink(this.drinkNumber);
    }
  }
}
