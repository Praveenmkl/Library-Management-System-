import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }
  return router.createUrlTree(['/admin/login']);
};

export const librarianGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && (authService.isLibrarian() || authService.isAdmin())) {
    return true;
  }
  return router.createUrlTree(['/auth/login']);
};

export const studentGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && (authService.isStudent() || authService.isAdmin())) {
    return true;
  }
  return router.createUrlTree(['/auth/login']);
};
