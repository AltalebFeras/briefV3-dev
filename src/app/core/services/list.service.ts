import { Injectable, inject } from '@angular/core';
import { List } from '../../models/list';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ListService {

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl; // Use environment variable
  private apiUrls = `${environment.apiUrl}/lists`;
  private apiUrlSingle = `${environment.apiUrl}/list`;

 getAllLists(): Observable<List[]> {
  return this.http
    .get<{ success: boolean; data: List[]; token?: string }>(`${this.apiUrls}/show/me`)
    .pipe(map((res) => res.data));
}

 getListBySlug(slug: string): Observable<List> {
  console.log('Getting list by slug:', slug); // Debug log
  return this.http
    .get<{ success: boolean; data: List; token?: string }>(`${this.apiUrlSingle}/show/${encodeURIComponent(slug)}`)
    .pipe(
      map((res) => {
        console.log('API response for list:', res); // Debug log
        if (res.success && res.data) {
          // Ensure slug is preserved in the returned data
          const listData = res.data;
          if (!listData.slug) {
            listData.slug = slug;
          }
          return listData;
        }
        throw new Error('Invalid response structure');
      }),
      catchError(error => {
        console.error('Error fetching list:', error);
        throw error;
      })
    );
}

createList(payload: { name: string; description?: string }): Observable<boolean> {
  return this.http.post<any>(`${this.apiUrlSingle}/new`, payload).pipe(
    map(res => res.success === true),
    catchError(err => {
      console.error('Erreur création liste:', err);
      return of(false);
    })
  );
}

  updateList(id: number, payload: { name?: string; description?: string }): Observable<List> {
    return this.http
      .put<{ success: boolean; data: List }>(`${this.apiUrlSingle}/${id}/edit`, payload)
      .pipe(map((res) => res.data));
  }

 deleteList(slug: string): Observable<boolean> {
  return this.http.delete<any>(`${this.apiUrlSingle}/delete/${encodeURIComponent(slug)}`).pipe(
    map(res => res.success === true)
  );
}

  // // Optionnel : utile pour la prévisualisation
  // private slugify(text: string): string {
  //   return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  // }
}
