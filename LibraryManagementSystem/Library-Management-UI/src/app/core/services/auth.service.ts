import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, switchMap, of, map, catchError } from 'rxjs';
import { UserDto, RegisterStudentDto, AuthResponse, LibrarianAccount, CreateLibrarianDto } from '../models/auth.model';
import { environment } from '../../../environments/environment';

export interface AppUser {
  username: string;
  role: string;
  email?: string;
  fullName?: string;
  memberId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly baseUrl = `${environment.apiUrl}/Auth`;

  // Signals
  private tokenSignal = signal<string | null>(localStorage.getItem('lms_token'));
  private currentUserSignal = signal<AppUser | null>(this.loadUserFromStorage());

  readonly token = this.tokenSignal.asReadonly();
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly memberId = computed(() => this.currentUserSignal()?.memberId || null);
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

  private loadUserFromStorage(): AppUser | null {
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
    const updated: AppUser = {
      ...current,
      fullName: data.fullName || current.fullName,
      email: data.email || current.email
    };
    localStorage.setItem('lms_user', JSON.stringify(updated));
    this.currentUserSignal.set(updated);
  }

  setMemberId(memberId: string) {
    const current = this.currentUserSignal();
    if (!current) return;
    const updated: AppUser = {
      ...current,
      memberId
    };
    localStorage.setItem('lms_user', JSON.stringify(updated));
    this.currentUserSignal.set(updated);
  }

  register(dto: RegisterStudentDto | UserDto): Observable<AuthResponse> {
    const payload = {
      username: dto.username || dto.email,
      password: dto.password,
      fullName: dto.fullName || dto.username,
      email: dto.email,
      phone: (dto as RegisterStudentDto).phone || '',
      address: (dto as RegisterStudentDto).address || ''
    };
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, payload);
  }

  login(userDto: { username: string; password: string; role?: string }): Observable<AuthResponse> {
    const payload = {
      username: userDto.username,
      password: userDto.password
    };
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload).pipe(
      tap(res => {
        if (res && res.token && res.user) {
          const role = res.user.role || userDto.role || 'Student';
          const username = res.user.username || userDto.username;
          const email = res.user.email || username;
          const fullName = res.user.fullName || username;
          const memberId = res.user.memberId || '';
          this.setSession(res.token, username, role, email, fullName, memberId);
        }
      })
    );
  }

  resolveMemberId(usernameOrEmail: string, fullName?: string): Observable<string | null> {
    const currentMemberId = this.memberId();
    if (currentMemberId) {
      return of(currentMemberId);
    }

    const term = usernameOrEmail.toLowerCase().trim();
    const nameTerm = (fullName || '').toLowerCase().trim();

    return this.http.get<any[]>(`${environment.apiUrl}/Members`).pipe(
      map(members => {
        const list = members || [];
        const found = list.find(m =>
          (m.email && m.email.toLowerCase() === term) ||
          (m.name && m.name.toLowerCase() === term) ||
          (m.name && nameTerm && m.name.toLowerCase() === nameTerm)
        );

        if (found && found.id) {
          this.setMemberId(found.id);
          return found.id as string;
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }

  // ── ADMIN LIBRARIAN MANAGEMENT ──────────────────────────────────────────
  getLibrarians(): Observable<LibrarianAccount[]> {
    return this.http.get<LibrarianAccount[]>(`${this.baseUrl}/librarians`);
  }

  createLibrarian(dto: CreateLibrarianDto): Observable<LibrarianAccount> {
    return this.http.post<LibrarianAccount>(`${this.baseUrl}/librarians`, dto);
  }

  toggleLibrarianStatus(id: string): Observable<LibrarianAccount> {
    return this.http.put<LibrarianAccount>(`${this.baseUrl}/librarians/${id}/toggle`, {});
  }

  deleteLibrarian(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/librarians/${id}`);
  }

  setSession(token: string, username: string, role: string, email?: string, fullName?: string, memberId?: string) {
    localStorage.setItem('lms_token', token);
    const user: AppUser = {
      username,
      role,
      email: email || username,
      fullName: fullName || username,
      memberId: memberId || ''
    };
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
