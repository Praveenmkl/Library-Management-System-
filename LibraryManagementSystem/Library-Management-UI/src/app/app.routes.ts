import { Routes } from '@angular/router';
import { studentGuard, librarianGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  
  // Public Auth
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent)
  },

  // Separate Protected Admin Login
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/admin-login.component').then(m => m.AdminLoginComponent)
  },

  // Student Routes
  {
    path: 'student',
    redirectTo: 'student/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'student/dashboard',
    canActivate: [studentGuard],
    loadComponent: () => import('./features/student/student-portal.component').then(m => m.StudentPortalComponent)
  },
  {
    path: 'student/books',
    canActivate: [studentGuard],
    loadComponent: () => import('./features/books/books.component').then(m => m.BooksComponent)
  },
  {
    path: 'student/borrowings',
    canActivate: [studentGuard],
    loadComponent: () => import('./features/borrowings/borrowings.component').then(m => m.BorrowingsComponent)
  },
  {
    path: 'student/profile',
    canActivate: [studentGuard],
    loadComponent: () => import('./features/student/student-portal.component').then(m => m.StudentPortalComponent)
  },

  // Librarian Routes
  {
    path: 'librarian',
    redirectTo: 'librarian/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'librarian/dashboard',
    canActivate: [librarianGuard],
    loadComponent: () => import('./features/librarian/librarian-portal.component').then(m => m.LibrarianPortalComponent)
  },
  {
    path: 'librarian/books',
    canActivate: [librarianGuard],
    loadComponent: () => import('./features/books/books.component').then(m => m.BooksComponent)
  },
  {
    path: 'librarian/books/create',
    canActivate: [librarianGuard],
    loadComponent: () => import('./features/books/books.component').then(m => m.BooksComponent)
  },
  {
    path: 'librarian/books/edit',
    canActivate: [librarianGuard],
    loadComponent: () => import('./features/books/books.component').then(m => m.BooksComponent)
  },
  {
    path: 'librarian/borrowings',
    canActivate: [librarianGuard],
    loadComponent: () => import('./features/borrowings/borrowings.component').then(m => m.BorrowingsComponent)
  },
  {
    path: 'librarian/returns',
    canActivate: [librarianGuard],
    loadComponent: () => import('./features/librarian/librarian-portal.component').then(m => m.LibrarianPortalComponent)
  },
  {
    path: 'librarian/students',
    canActivate: [librarianGuard],
    loadComponent: () => import('./features/members/members.component').then(m => m.MembersComponent)
  },
  {
    path: 'librarian/fines',
    canActivate: [librarianGuard],
    loadComponent: () => import('./features/borrowings/borrowings.component').then(m => m.BorrowingsComponent)
  },

  // Admin Routes
  {
    path: 'admin',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'admin/dashboard',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/admin-portal.component').then(m => m.AdminPortalComponent)
  },
  {
    path: 'admin/students',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/members/members.component').then(m => m.MembersComponent)
  },
  {
    path: 'admin/librarians',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/admin-portal.component').then(m => m.AdminPortalComponent)
  },
  {
    path: 'admin/books',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/books/books.component').then(m => m.BooksComponent)
  },
  {
    path: 'admin/borrowings',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/borrowings/borrowings.component').then(m => m.BorrowingsComponent)
  },
  {
    path: 'admin/reports',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'admin/settings',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/admin-portal.component').then(m => m.AdminPortalComponent)
  },

  // Fallback
  { path: '**', redirectTo: 'student/dashboard' }
];

