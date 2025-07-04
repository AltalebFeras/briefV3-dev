import { Injectable, signal } from '@angular/core';
import { User } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  private baseUrl: string = 'http://193.134.250.16/api/';

  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  getUsers(): Observable<User[]> {
    return this.http
      .get<{ data: { users: User[] } }>(
        `${this.baseUrl}admin/users`,
        this.getHeaders()
      )
      .pipe(map((res) => res.data.users));
  }

  blockUser(id: number): Observable<User> {
    return this.http.post<User>(
      `${this.baseUrl}admin/users/${id}/block`,
      {},
      this.getHeaders()
    );
  }

  unblockUser(id: number): Observable<User> {
    return this.http.post<User>(
      `${this.baseUrl}admin/users/${id}/unblock`,
      {},
      this.getHeaders()
    );
  }
}
