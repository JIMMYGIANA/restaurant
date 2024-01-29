import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';

export const isLoggedOutGuard: CanActivateFn = (route, state) => {
  return inject(UserService).isLoggedIn !== true;
};
