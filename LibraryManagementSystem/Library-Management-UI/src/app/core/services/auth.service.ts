import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UserDto, AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly baseUrl = 'http://localhost:5000/api/Auth';

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

  register(userDto: UserDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, userDto);
  }

  login(userDto: UserDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, userDto).pipe(
      tap(res => {
        if (res.token) {
          this.setSession(res.token, userDto.username, userDto.role || 'Student', userDto.email, userDto.fullName);
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
