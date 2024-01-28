import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { from, switchMap } from 'rxjs';
import { UserRole } from 'src/app/model/userModel';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  protected readonly email = new FormControl('', [Validators.required, Validators.email]);
  protected readonly password = new FormControl('', [Validators.required]);
  protected hide = true;


  readonly testForm: FormGroup = this._fb.group({ name: ['', Validators.required], });

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _router: Router,
    private readonly _userService: UserService,
    private readonly _cookieService: CookieService
  ) {
  }

  submitForm(): void {
    console.log('Form submitted with value:', this.testForm.value);
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  login(): void {

    console.log("dio login");

    if (!this.email.valid || !this.password.valid)
      return;

    const credentials = { email: this.email.value, password: this.password.value };
    this._userService
      .login(credentials)
      .pipe(
        switchMap(response => {
          switch (response.userRole) {
            case UserRole.Waiters: return from(this._router.navigate(['/restaurant']));
            case UserRole.Cashier: return from(this._router.navigate(['/cash']));
            case UserRole.Bartenders: return from(this._router.navigate(['/bar']));
            case UserRole.Cook: return from(this._router.navigate(['/kitchen']));
            default: return from(this._router.navigate(['/menu']));
          }
        }))
      .subscribe();
  }
}
