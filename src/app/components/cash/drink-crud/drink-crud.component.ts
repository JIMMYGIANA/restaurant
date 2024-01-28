import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IDrink } from 'src/app/model/drinkModel';
import { CashierService } from 'src/app/services/cashier.service';

@Component({
  selector: 'app-drink-crud',
  templateUrl: './drink-crud.component.html',
  styleUrl: './drink-crud.component.css'
})
export class DrinkCrudComponent {

  protected readonly drinkForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<DrinkCrudComponent>,
    private cashService: CashierService,
    private formBuilder: FormBuilder
  ){
    this.drinkForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      type: ['', [Validators.required,]],
      price: ['', [Validators.required]],
      isAlcoholic: ['', [Validators.required,]],
    });
  }

  onSubmit() {
    if (this.drinkForm.valid) {

      this.closeDialog();

      this.cashService.createDrink({
        number: 0,
        name: this.drinkForm.get('name')?.value,
        description: this.drinkForm.get('description')?.value,
        type: this.drinkForm.get('type')?.value,
        price: this.drinkForm.get('price')?.value,
        isAlcoholic: this.drinkForm.get('isAlcoholic')?.value,
      } as IDrink).subscribe();

      console.log(this.drinkForm.value);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
