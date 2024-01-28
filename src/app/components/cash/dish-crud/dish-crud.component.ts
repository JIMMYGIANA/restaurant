import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IDish } from 'src/app/model/dishModel';
import { CashierService } from 'src/app/services/cashier.service';

@Component({
  selector: 'app-dish-crud',
  templateUrl: './dish-crud.component.html',
  styleUrl: './dish-crud.component.css'
})
export class DishCrudComponent {

  protected readonly dishForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<DishCrudComponent>,
    private cashService: CashierService,
    private formBuilder: FormBuilder
  ){
    this.dishForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      type: ['', [Validators.required,]],
      price: ['', [Validators.required,]]
    });
  }

  onSubmit() {
    if (this.dishForm.valid) {

      this.closeDialog();

      this.cashService.createDish({
        number: 0,
        name: this.dishForm.get('name')?.value,
        description: this.dishForm.get('description')?.value,
        type: this.dishForm.get('type')?.value,
        price: this.dishForm.get('price')?.value
      } as IDish).subscribe();

      console.log(this.dishForm.value);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
