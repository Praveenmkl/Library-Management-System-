import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UserDto, AuthResponse } from '../models/auth.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly baseUrl = `${environment.apiUrl}/Auth`;

  // Signals
  private tokenSignal = signal<string | null>(localStorage.getItem('lms_token'));
  private currentUserSignal = signal<{ username: string; role: string; email?: string; fullName?: string } | null>(this.loadUserFromStorage());

  readonly token = this.tokenSignal.asReadonly();
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.tokenSignal() && !!this.currentUserSignal());
  readonly isAdmin = computed(() => (this.currentUserSignal()?.role || '').toLowerCase() === 'admin');
  readonly isLibrarian = computed(() => (this.currentUserSignal()?.role || '').toLowerCase() === 'librarian');
  readonly isStudent = computed(() => {
    const role = (this.currentUserSignal()?.role || '').toLowerCase();
    return role === 'student' || role === 'member';
  });

  // Role Permission Computed Flags
  readonly canManageBooks = computed(() => this.isAdmin() || this.isLibrarian());
  readonly canManageStudents = computed(() => this.isAdmin() || this.isLibrarian());
  readonly canCreateLibrarians = computed(() => this.isAdmin());
  readonly canChangeUserRoles = computed(() => this.isAdmin());
  readonly canManageSystemSettings = computed(() => this.isAdmin());
  readonly canViewReports = computed(() => this.isAdmin() || this.isLibrarian());

  private loadUserFromStorage(): { username: string; role: string; email?: string; fullName?: string } | null {
    const saved = localStorage.getItem('lms_user');
    if (!saved) {
      return null;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }

  updateCurrentUserProfile(data: { fullName?: string; email?: string }) {
    const current = this.currentUserSignal();
    if (!current) return;
    const updated = {
      ...current,
      fullName: data.fullName || current.fullName,
      email: data.email || current.email
    };
    localStorage.setItem('lms_user', JSON.stringify(updated));
    this.currentUserSignal.set(updated);
  }

  register(userDto: UserDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, userDto);
  }

  login(userDto: UserDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, userDto).pipe(
      tap(res => {
        if (res.token) {
          const role = res.user?.role || userDto.role || 'Student';
          const username = res.user?.username || userDto.username;
          this.setSession(res.token, username, role, userDto.email || username, userDto.fullName || username);
        }
      })
    );
  }

  setSession(token: string, username: string, role: string, email?: string, fullName?: string) {
    localStorage.setItem('lms_token', token);
    const user = { username, role, email: email || username, fullName: fullName || username };
    localStorage.setItem('lms_user', JSON.stringify(user));
    this.tokenSignal.set(token);
    this.currentUserSignal.set(user);
  }

  logout() {
    localStorage.removeItem('lms_token');
    localStorage.removeItem('lms_user');
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
    this.router.navigate(['/student/login']);
  }
}
