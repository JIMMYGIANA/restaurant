import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CashierService } from 'src/app/services/cashier.service';
import { ITable } from 'src/app/model/tableModel';

@Component({
  selector: 'app-cash',
  templateUrl: './cash.component.html',
  styleUrls: ['./cash.component.css']
})
export class CashComponent {
  protected readonly tables: Observable<ITable[]> = this.cashierService.readTables();

  constructor(
    protected readonly router: Router,
    private cashierService: CashierService
    ){
      this.tables.forEach(t => console.log(t));
  }
}
