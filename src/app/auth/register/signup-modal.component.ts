import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.css'],
})
export class SignupModalComponent {
  @Output() close = new EventEmitter<void>();
  private readonly auth = inject(AuthService);

  signupForm!: FormGroup<{
    email: FormControl<string>;
    emailConfirm: FormControl<string>;
    password: FormControl<string>;
    confirm_password: FormControl<string>;
    first_name: FormControl<string>;
    last_name: FormControl<string>;
    cgu_accepted: FormControl<boolean>;
  }>;

  submitted = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private readonly fb: FormBuilder, private toast: ToastrService) {
    this.signupForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        emailConfirm: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirm_password: ['', [Validators.required]],
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        cgu_accepted: [false, Validators.requiredTrue]
      },
      { validators: [this.matchEmails, this.matchPasswords] }
    );
  }

  onSubmit() {
    this.submitted = true;
    this.successMessage = null;
    this.errorMessage = null;

    if (this.signupForm.valid) {
      const formData = this.signupForm.getRawValue();
      this.auth.register(formData).subscribe({
        next: (response: any) => {
          // on vérifie si la réponse est un succès 
          if (response.success === false) {
            // on gere la validation d'erreur côté serveur
            this.errorMessage = response.message || `Erreur lors de l'inscription.`;
            this.toast.error(this.errorMessage!, "Erreur");
          } else {
            // cas de réussite
          this.successMessage =
            'Inscription réussie ! 🎉 Un email de confirmation vous a été envoyé.';
          this.toast.success(
            'Inscription réussie ! 🎉 Un email de confirmation vous a été envoyé.',
            'Succès'
          );
          this.signupForm.reset();
          this.submitted = false;
          this.close.emit();
        }
        },
      });
    }
  }

  onClose() {
    this.close.emit();
  }
  matchEmails(group: FormGroup) {
    const email = group.get('email')?.value;
    const emailConfirm = group.get('emailConfirm')?.value;
    return email === emailConfirm ? null : { emailMismatch: true };
  }

  matchPasswords(group: FormGroup) {
    const pass = group.get('password')?.value;
    const passConfirm = group.get('confirm_password')?.value;
    return pass === passConfirm ? null : { passwordMismatch: true };
  }
}
