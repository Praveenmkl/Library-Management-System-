import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Member } from '../models/member.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/Members`;

  // Reactive state
  readonly members = signal<Member[]>([]);
  readonly loading = signal<boolean>(false);

  loadAll(): Observable<Member[]> {
    this.loading.set(true);
    return this.http.get<Member[]>(this.baseUrl).pipe(
      tap({
        next: (data) => {
          this.members.set(data || []);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      })
    );
  }

  getById(id: string): Observable<Member> {
    return this.http.get<Member>(`${this.baseUrl}/${id}`);
  }

  create(member: Member): Observable<Member> {
    return this.http.post<Member>(this.baseUrl, member).pipe(
      tap(() => this.loadAll().subscribe())
    );
  }

  update(id: string, member: Member): Observable<Member> {
    return this.http.put<Member>(`${this.baseUrl}/${id}`, member).pipe(
      tap(() => this.loadAll().subscribe())
    );
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.loadAll().subscribe())
    );
  }
}
