import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITable } from 'src/app/model/tableModel';
import { CashierService } from 'src/app/services/cashier.service';

@Component({
  selector: 'app-table-crud',
  templateUrl: './table-crud.component.html',
  styleUrl: './table-crud.component.css'
})
export class TableCrudComponent {

  protected readonly tableForm: FormGroup;

  constructor(
    private cashService: CashierService,
    private formBuilder: FormBuilder
  ){
    this.tableForm = this.formBuilder.group({
      seats: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.tableForm.valid) {
      if(this.tableForm.get('seats')?.value > 0){ 
        this.cashService.createTable({
          number: 0,
          seats: this.tableForm.get('seats')?.value,
          clients: 0,
          state: false,
        } as ITable).subscribe();
      } else {
        alert('Seats number not valid!')
      }
    }
  }

}
