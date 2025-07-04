import { Component, Output, EventEmitter, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

// ✅ Déclaration du composant avec métadonnées
@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})

export class LoginFormComponent {
  logo = signal<string>(localStorage.getItem('siteLogo') || 'assets/logo.png');
  tempLogo = signal<string>(this.logo());
  editModeLogo: boolean = false;
  editMode: boolean = false;
  title = signal<string>(localStorage.getItem('siteTitle') || 'ShuffleMyTeam');
  tempTitle = signal<string>(this.title());


  editTitle() {
    this.tempTitle.set(this.title());
    this.editMode = true;
  }

  saveTitle() {
    const newTitle = this.tempTitle().trim();
    if (newTitle.length > 0) {
      this.title.set(newTitle);
      this.toast.success('Titre modifié', 'Succès');
      localStorage.setItem('siteTitle', newTitle);
    } else {
      this.toast.error('Titre invalide', 'Erreur');
    }
    this.editMode = false;
  }

  editLogo() {
    this.editModeLogo = true;
    this.tempLogo.set(this.logo());
  }

  saveLogo(event?: Event) {
    const input = event?.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        this.logo.set(result);
        this.tempLogo.set(result);
        localStorage.setItem('siteLogo', result);
        this.toast.success('Logo modifié', 'Succès');
        this.editModeLogo = false;
      };
      reader.readAsDataURL(file); // conversion en base64
    } else {
      // fallback si aucune image sélectionnée
      this.toast.error('Fichier invalide', 'Erreur'),
        (this.editModeLogo = false);
    }
  }
  // private router = new Router()
  // Formulaire réactif avec 2 champs

  // ✅ Déclaration d’un groupe de contrôles de formulaire

  loginForm: FormGroup;

  // ✅ Déclaration d’un événement envoyé au parent quand l’utilisateur veut s’inscrire
  @Output() openSignup = new EventEmitter<void>();


  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router,
    private toast: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],

    })};

  // ✅ Méthode appelée à la soumission du formulaire
  onSubmit(): void {
    const { email, password } = this.loginForm.value; // extraction des valeurs


    this.auth.login({ email, password }).subscribe({
      next: (user) => {
        console.log('Connexion réussie :', user); 
        this.toast.success('Connexion réussie', 'Succès');
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error('Erreur de connexion :', err); 
        this.toast.error('Email ou mot de passe incorrect', 'Erreur');

              console.error('❌ Erreur reçue depuis l’API :', err);
        if (err.status === 400) {
          this.toast.error('Requête invalide : vérifiez vos champs.', 'Erreur');
        } else if (err.status === 401) {
          this.toast.error('Identifiants incorrects.', 'Erreur');
        } else {
          this.toast.error('Erreur inattendue, veuillez réessayer.', 'Erreur');
        }

      },
    });
  }

  onSignupClick() {
    this.openSignup.emit(); // ✅ dit au parent "ouvre la modale"
    

        
      }
  }


