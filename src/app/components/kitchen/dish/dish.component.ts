import { CookieService } from 'ngx-cookie-service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { IDish } from 'src/app/model/dishModel';
import { CooksService } from 'src/app/services/cooks.service';

@Component({
  selector: 'app-dish',
  templateUrl: './dish.component.html',
  styleUrl: './dish.component.css'
})
export class DishComponent implements OnInit {
  @Input() dishNumber!: number;

  protected dishData: Observable<IDish> | undefined = undefined;

  constructor(
    private cooksService: CooksService
  ){
    
  }

  ngOnInit(): void {
    if (!isNaN(this.dishNumber)) {
      this.dishData = this.cooksService.getDish(this.dishNumber);
    }
  }
}
