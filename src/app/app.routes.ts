import { Routes } from '@angular/router';
import { UsersComponent } from './adminpage/users/users.component';
import { ProfileComponent } from './ProfilePage/profile/profile.component';
import { StatsComponent } from './adminpage/stats/stats.component';
import { HomePageComponent } from './auth/home-page/home-page.component';
import { ListDetailComponent } from './ListsPage/list-detail/list-detail.component';
import { ListPreviewComponent } from './ListsPage/list-preview/list-preview.component';
import { ListsUserComponent } from './ListsPage/lists/lists.component';
import { MentionsLegalesComponent } from './legal/mentions-legales/mentions-legales.component';
import { AuthenticatedLayoutComponent } from './layout/authenticated-layout/authenticated-layout.component';
import { GroupPageComponent } from './Groups/group-page/group-page.component';
import { DrawHistoryComponent } from './DrawHistory/draw-history/draw-history.component';
import { AuthGuard } from './core/guards/auth.guard';
import { NoAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    canActivate: [NoAuthGuard]
  },
  {
    path: '',
    component: AuthenticatedLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'lists', component: ListsUserComponent },
      { path: 'lists/:slug', component: ListDetailComponent },
      { path: 'list-preview/:slug', component: ListPreviewComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'draw-history', component: DrawHistoryComponent },
      { path: 'admin/users', component: UsersComponent },
      { path: 'admin/stats', component: StatsComponent },
      { path: 'legal', component: MentionsLegalesComponent },
      { path: 'groups', component: GroupPageComponent },
    ],
  },
];
