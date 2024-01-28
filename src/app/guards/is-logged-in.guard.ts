import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { from } from 'rxjs';
import { UserService } from '../services/user.service';

export const isLoggedInGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  if (userService.isLoggedIn)
    return true;
  return from(router.navigate(['login']));
};
