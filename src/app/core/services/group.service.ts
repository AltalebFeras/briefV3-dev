import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DrawResponse, Group, GroupGenerationConfig } from '../../models/group.model';
import { DrawDetailResponse, DrawHistoryEntry, DrawsListResponse } from '../../models/draw-history-entry.model';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private http = inject(HttpClient);

  // Crée un tirage (draw) en répartissant les personnes en groupes
  createDraw(config: GroupGenerationConfig): Observable<DrawResponse> {
    const payload = {
      list_slug: config.listSlug,
      number_of_groups: config.numberOfGroups,
      draw_name: config.drawName || null,
    };
    return this.http.post<DrawResponse>('/api/draw/new', payload, {
      withCredentials: true,
    });
  }

  // Confirme (valide) un tirage finalisé
  confirmDraw(groups: Group[]): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>('/api/groups/validate', groups, {
      withCredentials: true,
    });
  }

  // Récupère l’historique des tirages
  fetchDrawHistory(): Observable<DrawHistoryEntry[]> {
    return this.http.get<DrawHistoryEntry[]>('/api/groups/draw-history', {
      withCredentials: true,
    });
  }

  // Récupère les détails d’un tirage spécifique
  getDrawDetails(drawName: string): Observable<DrawDetailResponse> {
    return this.http.get<DrawDetailResponse>(`http://193.134.250.16/api/draw/show/${encodeURIComponent(drawName)}`, {
      withCredentials: true,
    });
  }

  // Récupère tous les tirages d’une liste donnée
  getAllDrawsForList(listSlug: string): Observable<DrawsListResponse> {
    return this.http.get<DrawsListResponse>(`http://193.134.250.16/api/draws/show/${encodeURIComponent(listSlug)}`, {
      withCredentials: true,
    });
  }
}
