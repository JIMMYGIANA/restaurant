import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { UserRole } from './model/userModel';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  readonly title = 'restaurant';

  protected readonly userRole$ = this._userService.session$.pipe(map(s => {
    if (s == null)
      return undefined;
    switch (s?.userRole) {
      case UserRole.Cashier: return 'Cashier';
      case UserRole.Bartenders: return 'Bartender';
      case UserRole.Cook: return 'Cook';
      case UserRole.Waiters: return 'Waiter';
      default: throw new Error('Unsupported role: ' + s?.userRole);
    }
  }));
  protected readonly isLoggedIn$ = this._userService.isLoggedIn$;

  protected readonly isCashier$ = this._userService.userRole$.pipe(map(role => role === UserRole.Cashier));
  protected readonly isBartender$ = this._userService.userRole$.pipe(map(role => role === UserRole.Bartenders));
  protected readonly isCook$ = this._userService.userRole$.pipe(map(role => role === UserRole.Cook));
  protected readonly isWaiter$ = this._userService.userRole$.pipe(map(role => role === UserRole.Waiters));

  constructor(
    private readonly _userService: UserService,
    private readonly _router: Router) { }

  protected logout() {
    this._userService
      .logout()
      .pipe(
        switchMap(() => this._router.navigate(['/'])))
      .subscribe();
  }
}
