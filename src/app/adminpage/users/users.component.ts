import { Component, inject, OnInit, signal } from '@angular/core';
import { UsersService } from '../services/users.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  constructor(private toastr: ToastrService) {}

  private userService = inject(UsersService);

  users = signal<User[]>([]);

  ngOnInit(): void {
    try {
      this.userService.getUsers().subscribe((data) => {
        this.users.set(data);
        this.toastr.success('Utilisateurs chargés', 'Succès');
      });
    } catch (error) {
      this.toastr.error('Erreur serveur', 'Erreur');
      console.log(error);
    }
  }

  onToggleBlock(user: User) {
    if (user.is_blocked) {
      this.unblockUser(user.id);
    } else {
      this.blockUser(user.id);
    }
  }

  blockUser(id: number) {
    console.log(id);
    try {
      this.userService.blockUser(id).subscribe((data) => {
        const user = this.users().find((u) => u.id === id);
        if (user) user.is_blocked = true;
        this.users.set([...this.users()]);
        this.toastr.success('Utilisateur bloqué', "Succès");
      });
    } catch (error) {
      console.log(error);
      this.toastr.error('Erreur serveur', 'Erreur');
    }
  }
  unblockUser(id: number) {
    console.log(id);
    try {
      this.userService.unblockUser(id).subscribe((data) => {
        const user = this.users().find((u) => u.id === id);
        if (user) user.is_blocked = false;
        this.users.set([...this.users()]);
        this.toastr.success('Utilisateur débloqué', "Succès");
      });
    } catch (error) {
      console.log(error);
      this.toastr.error('Erreur serveur', 'Erreur');
    }
  }
}
