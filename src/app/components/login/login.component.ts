import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { take } from 'rxjs';
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


  testForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    protected readonly router: Router,
    private userService: UserService,
    private cookieService: CookieService
  ) {
    this.testForm = this.fb.group({
      name: ['', Validators.required],
    });
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
    console.log("dio login")
    if (this.email.valid && this.password.valid) {
      const credentials = { email: this.email.value, password: this.password.value };

      this.userService.login(credentials).subscribe(
        (response) => {
          console.log('Observable emitted value:', response);
          this.handleLoginSuccess(response);
        },
        (error) => {
          console.error('Authentication error:', error);

          if (error instanceof HttpErrorResponse) {
            // Handle HTTP errors (status code, etc.)
            console.error('HTTP Error Status:', error.status);
            console.error('HTTP Error Message:', error.message);
            // You can extract more information from the error object if needed
          } else {
            // Handle non-HTTP errors
            console.error('Non-HTTP Error:', error);
          }

          // Provide user-friendly feedback or redirect to an error page
          // For example, set a variable for displaying an error message in the UI
          // this.loginError = 'Invalid username or password';
        },
        () => {
          console.log('Observable completed'); // Ensure this log is reached
        }
      );

    }
  }

  handleLoginSuccess(response: any): void {
    const token = response.token;
    
    if(this.cookieService.get('authToken') != null){
      this.userService.logout();
    }

    this.cookieService.set('authToken', token);
    
    switch (response.userRole) {
      case UserRole.Waiters:
        this.router.navigate(['/restaurant']);
        break;

      case UserRole.Cashier:
        this.router.navigate(['/cash']);
        break;

      case UserRole.Bartenders:
        this.router.navigate(['/bar']);
        break;

      case UserRole.Cook:
        this.router.navigate(['/kitchen']);
        break;
      default:
        this.router.navigate(['/menu']);
        break;
    }
    
  }
}
