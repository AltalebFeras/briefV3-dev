import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  sidebarLinks = [
    {
      id: 'lists',
      label: 'Mes Listes',
      path: '/lists',
      roles: ['user', 'admin'],
    },
    {
      id: 'draw-history',
      label: 'Mes Groupes',
      path: '/draw-history',
      roles: ['user', 'admin'],
    },
    {
      id: 'admin-users',
      label: 'Utilisateurs',
      path: '/admin/users',
      roles: ['admin'],
    },
    {
      id: 'admin-stats',
      label: 'Statistiques',
      path: '/admin/stats',
      roles: ['admin'],
    },
  ];

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // Stocke le rôle courant de l'utilisateur (admin ou user)
  userRole: 'admin' | 'user' = 'user';
  adminRole: 'admin' | 'user' = 'admin';

  // Signal représentant l'état d'ouverture de la sidebar
  isOpen = signal(false);
  window: any;

  isActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }

  ngOnInit(): void {
    // Récupération du rôle de l'utilisateur via AuthService
    this.userRole = this.auth.getCurrentUserRole() as 'user' | 'admin';

    // En mode desktop, la sidebar est toujours visible
    if (window.innerWidth >= 768) {
      this.isOpen.set(true);
    }
  }

  //ANCIENNE VERSION
  //   ngOnInit(): void {
  //   // Récupération du rôle de l'utilisateur via AuthService
  //   this.userRole = this.auth.getCurrentUserRole();
  //   // En mode desktop, la sidebar est toujours visible
  //   if (window.innerWidth >= 768) {
  //     this.isOpen.set(true);
  //   }
  // }

  // Détermine si l'utilisateur courant est un admin
  isAdmin(): boolean {
    return this.userRole === 'admin';
  }

  // Ouvre ou ferme la sidebar (mobile uniquement)
  toggleSidebar(): void {
    this.isOpen.update((prev) => !prev);
  }
  // Ferme la sidebar (après navigation sur mobile)
  closeSidebar(): void {
    this.isOpen.set(false);
  }
  logout(): void {
    this.auth.logout(); // ← déconnecte proprement via le service
    this.router.navigate(['/']);
  }
  isMobile(): boolean {
    return window.innerWidth < 768;
  }
}
