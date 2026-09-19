import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5000/api/Books';

  // Reactive state
  readonly books = signal<Book[]>([]);
  readonly loading = signal<boolean>(false);

  loadAll(): Observable<Book[]> {
    this.loading.set(true);
    return this.http.get<Book[]>(this.baseUrl).pipe(
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
    return this.http.get<Book>(`${this.baseUrl}/${id}`);
  }

  create(book: Book): Observable<Book> {
    return this.http.post<Book>(this.baseUrl, book).pipe(
      tap(() => this.loadAll().subscribe())
    );
  }

  update(id: string, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.baseUrl}/${id}`, book).pipe(
      tap(() => this.loadAll().subscribe())
    );
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.loadAll().subscribe())
    );
  }
}
