import { Routes } from '@angular/router';
import { studentGuard, librarianGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'student/login', pathMatch: 'full' },
  
  // ── STUDENT AUTH (public) ─────────────────────────────────────────────────
  {
    path: 'student/login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'student/register',
    loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent)
  },

  // ── STAFF AUTH (public) ───────────────────────────────────────────────────
  {
    path: 'staff/login',
    loadComponent: () => import('./features/auth/staff-login.component').then(m => m.StaffLoginComponent)
  },

  // ── ADMIN AUTH (public) ───────────────────────────────────────────────────
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/admin-login.component').then(m => m.AdminLoginComponent)
  },

  // ── STUDENT ROUTES (protected) ────────────────────────────────────────────
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

  // ── STAFF / LIBRARIAN ROUTES (protected) ──────────────────────────────────
  {
    path: 'staff',
    redirectTo: 'staff/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'staff/dashboard',
    canActivate: [librarianGuard],
    loadComponent: () => import('./features/librarian/librarian-portal.component').then(m => m.LibrarianPortalComponent)
  },
  {
    path: 'staff/books',
    canActivate: [librarianGuard],
    loadComponent: () => import('./features/books/books.component').then(m => m.BooksComponent)
  },
  {
    path: 'staff/books/create',
    canActivate: [librarianGuard],
    loadComponent: () => import('./features/books/books.component').then(m => m.BooksComponent)
  },
  {
    path: 'staff/books/edit',
    canActivate: [librarianGuard],
    loadComponent: () => import('./features/books/books.component').then(m => m.BooksComponent)
  },
  {
    path: 'staff/borrowings',
    canActivate: [librarianGuard],
    loadComponent: () => import('./features/borrowings/borrowings.component').then(m => m.BorrowingsComponent)
  },
  {
    path: 'staff/returns',
    canActivate: [librarianGuard],
    loadComponent: () => import('./features/librarian/librarian-portal.component').then(m => m.LibrarianPortalComponent)
  },
  {
    path: 'staff/students',
    canActivate: [librarianGuard],
    loadComponent: () => import('./features/members/members.component').then(m => m.MembersComponent)
  },
  {
    path: 'staff/fines',
    canActivate: [librarianGuard],
    loadComponent: () => import('./features/borrowings/borrowings.component').then(m => m.BorrowingsComponent)
  },
  {
    path: 'staff/reports',
    canActivate: [librarianGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },

  // Legacy librarian/* redirects (backwards compatibility)
  { path: 'librarian', redirectTo: 'staff/dashboard', pathMatch: 'full' },
  { path: 'librarian/dashboard', redirectTo: 'staff/dashboard', pathMatch: 'full' },
  { path: 'librarian/books', redirectTo: 'staff/books', pathMatch: 'full' },
  { path: 'librarian/borrowings', redirectTo: 'staff/borrowings', pathMatch: 'full' },
  { path: 'librarian/returns', redirectTo: 'staff/returns', pathMatch: 'full' },
  { path: 'librarian/students', redirectTo: 'staff/students', pathMatch: 'full' },
  { path: 'librarian/fines', redirectTo: 'staff/fines', pathMatch: 'full' },

  // Legacy auth/* redirects (backwards compatibility)
  { path: 'auth/login', redirectTo: 'student/login', pathMatch: 'full' },
  { path: 'auth/register', redirectTo: 'student/register', pathMatch: 'full' },

  // Friendly aliases
  { path: 'books', redirectTo: 'student/books', pathMatch: 'full' },
  { path: 'borrowings', redirectTo: 'student/borrowings', pathMatch: 'full' },

  // ── ADMIN ROUTES (protected) ──────────────────────────────────────────────
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
  { path: '**', redirectTo: 'student/login' }
];
