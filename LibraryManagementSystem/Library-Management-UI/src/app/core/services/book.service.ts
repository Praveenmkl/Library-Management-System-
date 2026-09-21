import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { Book } from '../models/book.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/Books`;

  // Reactive state
  readonly books = signal<Book[]>([]);
  readonly loading = signal<boolean>(false);

  loadAll(): Observable<Book[]> {
    this.loading.set(true);
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(data => (data || []).map(b => ({
        ...b,
        isbn: b.isbn || b.ISBN || ''
      }))),
      tap({
        next: (data) => {
          this.books.set(data || []);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      })
    );
  }

  getById(id: string): Observable<Book> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(b => ({
        ...b,
        isbn: b.isbn || b.ISBN || ''
      }))
    );
  }

  create(book: Book): Observable<Book> {
    const payload = {
      ...book,
      ISBN: book.isbn
    };
    return this.http.post<Book>(this.baseUrl, payload).pipe(
      tap(() => this.loadAll().subscribe())
    );
  }

  update(id: string, book: Book): Observable<Book> {
    const payload = {
      ...book,
      ISBN: book.isbn
    };
    return this.http.put<Book>(`${this.baseUrl}/${id}`, payload).pipe(
      tap(() => this.loadAll().subscribe())
    );
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.loadAll().subscribe())
    );
  }
}
