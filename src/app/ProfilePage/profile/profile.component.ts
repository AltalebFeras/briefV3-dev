import { Component, inject, OnInit } from '@angular/core';
import { ProfileService } from '../../core/services/profile.service';
import { User } from '../../models/user.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  constructor(private toast: ToastrService, private readonly router: Router) {}

  // Injection du service Profil et du FormBuilder (avec la syntaxe `inject()`)
  private profilService = inject(ProfileService);
  private formBuilder = inject(FormBuilder);
  private authservice = inject(AuthService);

  // Objet utilisateur à afficher et modifier
  user!: User;

  editMode: boolean = false;

  // Formulaire réactif pour modifier nom/prénom
  profileForm!: FormGroup;

  // permet d'afficher un loading après la sauvegarde de nouvelles informations
  isLoading: boolean = false;

  // afficher un loading après la suppression
  isDeleting = false;

  ngOnInit(): void {
    // Récupération de l'utilisateur mocké via le service
    this.profilService.getUser().subscribe((data) => {
      this.user = data; // Stockage local
      this.initForm(); // Initialisation du formulaire avec les valeurs récupérées
    });
  }
  // Création du formulaire avec les données existantes
  initForm(): void {
    if (!this.user) return; // Protection simple

    this.profileForm = this.formBuilder.group({
      email: [this.user.email],
      first_name: [this.user.first_name],
      last_name: [this.user.last_name],
    });
  }

  // Active ou désactive le mode édition (affichage formulaire)
  toggleEditMode(): void {
    if (this.editMode === false) {
      this.editMode = true;
      console.log('🌀 toggle activé');
    }
  }

  // Sauvegarde les modifications : fusionne les nouvelles données avec l'utilisateur existant
  save(): void {
    this.isLoading = true;

    const updatedUser = {
      ...this.user,
      ...this.profileForm.value,
    };

    this.profilService
      .updateUser(updatedUser)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.user = response;
          this.toast.success('Informations mises à jour', 'Succès');
          this.editMode = false;
        },
        error: () => {
          this.toast.error('Erreur lors de la mise à jour');
        },
      });
  }

  // Suppression simulée du compte avec message de confirmation et redirection
  confirmDelete(): void {
    const confirmed = confirm('Es-tu sûr(e) de vouloir supprimer ton compte ?');
    if (confirmed) {
      this.isDeleting = true;
      this.profilService
        .deleteUser()
        .pipe(finalize(() => (this.isDeleting = false)))
        .subscribe(() => {
          this.toast.success('Compte supprimé', 'Succès');
          this.authservice.logout(); // 🔥 déconnexion propre
          // 💡 petite pause avant redirection
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1000);
        });
    }
  }
}
