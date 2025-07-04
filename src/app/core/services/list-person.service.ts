import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Person } from '../../models/person';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ListPersonService {
  private readonly http = inject(HttpClient);
  private apiUrl = environment.apiUrl; // Use environment variable

  // ✅ Create person
  addPersonToList(listSlug: string, personData: any): Observable<Person> {
    console.log('Adding person to list:', listSlug);
    console.log('Person data:', personData);

    if (!listSlug) {
      throw new Error('List slug is required');
    }

    return this.http.post<{ success: boolean; person: Person; token?: string }>(
      `${this.apiUrl}/person/new`,
      personData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).pipe(
      map(res => {
        console.log('Person creation response:', res);
        if (res.success && res.person) {
          return res.person;
        } else {
          throw new Error('Invalid API response');
        }
      }),
      catchError(this.handleError)
    );
  }

  // ✏️ Update person
  updatePerson(personSlug: string, updatedData: Partial<Person>): Observable<Person> {
    return this.http.put<{ success: boolean; person: Person; token?: string }>(
      `${this.apiUrl}/person/edit/${personSlug}`,
      updatedData
    ).pipe(
      map(res => res.person),
      catchError(this.handleError)
    );
  }

  // ❌ Delete person
  deletePerson(personSlug: string): Observable<void> {
    return this.http.delete<{ success: boolean; token?: string }>(
      `${this.apiUrl}/person/delete/${personSlug}`
    ).pipe(
      map(() => void 0),
      catchError(this.handleError)
    );
  }

  // 👤 Get person by slug
  getPersonBySlug(slug: string): Observable<Person> {
    return this.http.get<{ success: boolean; person: Person; token?: string }>(
      `${this.apiUrl}/person/show/${slug}`
    ).pipe(
      map(res => res.person),
      catchError(this.handleError)
    );
  }

  // 👥 Get all persons for a list
  getPersonsByListSlug(listSlug: string): Observable<Person[]> {
    return this.http.get<{ success: boolean; data: Person[]; token?: string }>(
      `${this.apiUrl}/list/show/${encodeURIComponent(listSlug)}`
    ).pipe(
      map(res => res.data || []),
      catchError((error) => {
        if (error.status === 404) {
          return []; // Return empty array if no persons found
        }
        return throwError(() => error);
      })
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    console.error('Full error object:', error);
    console.error('Error status:', error.status);
    console.error('Error body:', error.error);

    if (error.error?.error) {
      // Handle single error message (404 case)
      errorMessage = error.error.error;
    } else if (error.error?.errors) {
      // Handle validation errors (406 case)
      const errors = error.error.errors;
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey && errors[firstErrorKey]) {
        const errorArray = errors[firstErrorKey];
        errorMessage = Array.isArray(errorArray) ? errorArray[0] : errorArray;
      }
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status === 0) {
      errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
    }

    return throwError(() => new Error(errorMessage));
  }
}
