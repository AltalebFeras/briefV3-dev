import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Person } from '../../models/person';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListPersonService {

    private readonly http = inject(HttpClient);
    private apiUrl = 'http://193.134.250.16/api';

addPersonToList(listSlug: string, personData: Partial<Person>): Observable<any> {
  const payload = {
    ...personData,
    list: listSlug
  };
  return this.http.post<{ success: boolean; person: Person }>(`${this.apiUrl}/person/new`, payload)
  .pipe(map(res => res.person));

}

  // ✏️ Modifier une personne (via son slug)
  updatePerson(personSlug: string, updatedData: Partial<Person>): Observable<Person> {
    return this.http.put<{ success: boolean; person: Person; token: string }>(
      `${this.apiUrl}/person/edit/${personSlug}`,
      updatedData
    ).pipe(map(res => res.person));
  }

  // ❌ Supprimer une personne (via son slug)
  deletePerson(personSlug: string): Observable<void> {
    return this.http.delete<{ success: boolean; token: string }>(
      `${this.apiUrl}/person/delete/${personSlug}`
    ).pipe(map(() => void 0));
  }

  // 👤 Récupérer une personne par slug
  getPersonBySlug(slug: string): Observable<Person> {
    return this.http.get<{ success: boolean; person: Person; token: string }>(
      `${this.apiUrl}/person/show/${slug}`
    ).pipe(map(res => res.person));
  }

  // 👥 Récupérer toutes les personnes d'une liste - UPDATED to match API doc
  getPersonsByListSlug(listSlug: string): Observable<Person[]> {
    return this.http.get<{ success: boolean; data: Person[]; token?: string }>(
      `${this.apiUrl}/list/show/${encodeURIComponent(listSlug)}`
    ).pipe(map(res => res.data || []));
  }


}
