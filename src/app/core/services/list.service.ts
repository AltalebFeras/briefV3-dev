import { Injectable, inject } from '@angular/core';
import { List } from '../../models/list';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ListService {

  private http = inject(HttpClient);
  private apiUrls = 'http://193.134.250.16/api/lists';
  private apiUrl = 'http://193.134.250.16/api/list';

 getAllLists(): Observable<List[]> {
  return this.http
    .get<{ success: boolean; data: List[]; token?: string }>(`${this.apiUrls}/show/me`)
    .pipe(map((res) => res.data));
}

 getListBySlug(slug: string): Observable<List> {
  return this.http
    .get<{ success: boolean; data: List; token?: string }>(`${this.apiUrl}/show/${encodeURIComponent(slug)}`)
    .pipe(map((res) => res.data));
}

createList(payload: { name: string; description?: string }): Observable<boolean> {
  return this.http.post<any>(`${this.apiUrl}/new`, payload).pipe(
    map(res => res.success === true),
    catchError(err => {
      console.error('Erreur création liste:', err);
      return of(false);
    })
  );
}

  updateList(id: number, payload: { name?: string; description?: string }): Observable<List> {
    return this.http
      .put<{ success: boolean; data: List }>(`${this.apiUrl}/${id}/edit`, payload)
      .pipe(map((res) => res.data));
  }

 deleteList(slug: string): Observable<boolean> {
  return this.http.delete<any>(`${this.apiUrl}/delete/${encodeURIComponent(slug)}`).pipe(
    map(res => res.success === true)
  );
}

  // // Optionnel : utile pour la prévisualisation
  // private slugify(text: string): string {
  //   return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  // }
}
