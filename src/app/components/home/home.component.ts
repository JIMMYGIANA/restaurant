import { Component } from '@angular/core';
import { map } from 'rxjs';
import { UserRole } from 'src/app/model/userModel';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private readonly _userService: UserService) { }

  public readonly isLoggedIn$ = this._userService.isLoggedIn$;
  public readonly isCashier$ = this._userService.userRole$.pipe(map(role => role === UserRole.Cashier));
  public readonly isBartender$ = this._userService.userRole$.pipe(map(role => role === UserRole.Bartenders));
  public readonly isCook$ = this._userService.userRole$.pipe(map(role => role === UserRole.Cook));
  public readonly isWaiter$ = this._userService.userRole$.pipe(map(role => role === UserRole.Waiters));
}
