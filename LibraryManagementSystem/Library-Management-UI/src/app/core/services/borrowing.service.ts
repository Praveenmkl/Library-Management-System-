import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Borrowing } from '../models/borrowing.model';

@Injectable({
  providedIn: 'root'
})
export class BorrowingService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5000/api/Borrowings';

  // Reactive state
  readonly borrowings = signal<Borrowing[]>([]);
  readonly loading = signal<boolean>(false);

  loadAll(): Observable<Borrowing[]> {
    this.loading.set(true);
    return this.http.get<Borrowing[]>(this.baseUrl).pipe(
      tap({
        next: (data) => {
          this.borrowings.set(data || []);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      })
    );
  }

  getById(id: string): Observable<Borrowing> {
    return this.http.get<Borrowing>(`${this.baseUrl}/${id}`);
  }

  borrowBook(borrowing: Borrowing): Observable<Borrowing> {
    return this.http.post<Borrowing>(`${this.baseUrl}/borrow`, borrowing).pipe(
      tap(() => this.loadAll().subscribe())
    );
  }

  returnBook(id: string): Observable<Borrowing> {
    return this.http.post<Borrowing>(`${this.baseUrl}/return/${id}`, {}).pipe(
      tap(() => this.loadAll().subscribe())
    );
  }
}
