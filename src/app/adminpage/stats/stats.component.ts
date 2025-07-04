import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ListStats } from '../../models/liststats.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-stats',
  imports: [],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css',
})
export class StatsComponent implements OnInit {
  private http = inject(HttpClient);

  users = signal<User[]>([]);
  lists = signal<ListStats[]>([]);

  ngOnInit(): void {
    this.http.get<User[]>('/assets/users.json').subscribe((data) => {
      this.users.set(data);
    });
    this.http.get<ListStats[]>('/assets/lists.json').subscribe((data) => {
      this.lists.set(data);
    });
  }

  // Nombre total d'utilisateurs
  userCount = computed(() => {
    return this.users().length;
  });

  // Nombre total de listes
  listCount = computed(() => {
    return this.lists().length;
  });

  // ◦ nombre de personnes par liste en moyenne
  personCount = computed(() => {
    const lists = this.lists();
    if (!lists.length) return 0;
    const total = lists.reduce(
      (sum, list) => sum + (list.personAmount || 0),
      0
    );
    const average = Math.round(total / lists.length);
    return average;
  });

  // ◦ nombre de groupes créés par liste en moyenne
  groupCount = computed(() => {
    const lists = this.lists();
    if (!lists.length) return 0;
    const total = lists.reduce(
      (sum, list) => sum + (list.tirageAmount || 0),
      0
    );
    const average = Math.round(total / lists.length);
    return average;
  });
  // ◦ nombre de listes partagées
  sharedListsAmount = signal<number>(0);
  // ◦ nombre d’utilisateurs associés à une liste partagée en moyenne
  sharedUsersAmount = signal<number>(0);
  // modifier le titre du site
  siteTitle = signal<string>('');
  // modifier le logo
  logo = signal<string>('');
  // modifier les couleurs principales
  primaryColor = signal<string>('#D10000');
  secondaryColor = signal<string>('#FFFFFF');
  tertiaryColor = signal<string>('#333333');
}
