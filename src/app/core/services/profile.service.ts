import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://193.134.250.16/api';

  constructor() {}

  // Récupère l'utilisateur courant via l'API
  getUser(): Observable<User> {
    return this.http
      .get<{ success: boolean; data: User }>(`${this.API_URL}/user/show/me`)
      .pipe(map((res) => res.data));
  }

  // Met à jour l'utilisateur via l'API
  updateUser(updated: {
    email: string;
    first_name: string;
    last_name: string;
  }): Observable<User> {
    return this.http
      .post<{ success: boolean; data: User }>(
        `${this.API_URL}/user/edit/me`,
        updated
      )
      .pipe(map((res) => res.data));
  }
  
  // Supprime le compte utilisateur via l'API
  deleteUser(): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/user/delete/me`);
  }

  // Accepte les CGU côté front (localStorage)
  acceptTerms(): void {
    const stored = localStorage.getItem('currentUser');
    if (!stored) return;

    const user = JSON.parse(stored);
    user.cgu_accepted_at = new Date().toISOString();
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}
