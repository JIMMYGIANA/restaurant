import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/model/userModel';
import { CashierService } from 'src/app/services/cashier.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-crud',
  templateUrl: './user-crud.component.html',
  styleUrl: './user-crud.component.css'
})
export class UserCrudComponent {


  protected readonly userForm: FormGroup;

  constructor(
    private cashService: CashierService,
    private formBuilder: FormBuilder
  ){
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.min(4)]],
      role: ['', [Validators.required,]]
    });
  }

  onSubmit() {
    if (this.userForm.valid) {

      this.cashService.createUser({
        email: this.userForm.get('email')?.value,
        username: this.userForm.get('username')?.value,
        password: this.userForm.get('password')?.value,
        role: this.userForm.get('role')?.value,
      } as IUser).subscribe();

      console.log(this.userForm.value);
    }
  }
}
