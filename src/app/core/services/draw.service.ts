import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import {
  CreateDrawRequest,
  DrawResponse,
  DrawListResponse,
  DrawDetailResponse
} from '../../models/draw.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DrawService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl; // Use environment variable

  // ✨ Create new draw
  createDraw(request: CreateDrawRequest): Observable<DrawResponse> {
    return this.http.post<DrawResponse>(`${this.apiUrl}/draw/new`, request).pipe(
      catchError(this.handleError)
    );
  }

  // 📋 Get all draws for a list
  getAllDrawsForList(listSlug: string): Observable<DrawListResponse> {
    return this.http.get<DrawListResponse>(
      `${this.apiUrl}/draws/show/${encodeURIComponent(listSlug)}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // 🎯 Get specific draw details
  getDrawDetails(drawName: string): Observable<DrawDetailResponse> {
    return this.http.get<DrawDetailResponse>(
      `${this.apiUrl}/draw/show/${encodeURIComponent(drawName)}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}
