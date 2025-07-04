import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component'; // adapte si besoin

@Component({
  standalone: true,
  selector: 'app-authenticated-layout',
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './authenticated-layout.component.html',
  styleUrls: ['./authenticated-layout.component.css'],
})
export class AuthenticatedLayoutComponent {}
