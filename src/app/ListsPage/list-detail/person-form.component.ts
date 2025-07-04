import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ListPersonService } from '../../core/services/list-person.service';
import { Gender, Profile } from '../../models/person';

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css']
})
export class PersonFormComponent {
  form: FormGroup;
  genderOptions = Object.values(Gender);
  profileOptions = Object.values(Profile);
  listSlug!: string;
  errorMessage = '';
  isSubmitting = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly listPersonService: ListPersonService,
    private readonly dialogRef: MatDialogRef<PersonFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('PersonFormComponent data received:', data); // Debug log

    if (!data || !data.listSlug) {
      console.error('No listSlug provided to PersonFormComponent');
      this.errorMessage = 'Erreur: identifiant de liste manquant';
    }

    this.listSlug = data?.listSlug || '';

    this.form = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      last_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      gender: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1), Validators.max(99)]],
      french_level: [1, [Validators.required, Validators.min(1), Validators.max(4)]],
      tech_level: [1, [Validators.required, Validators.min(1), Validators.max(4)]],
      dwwm: [false],
      profile: ['', Validators.required]
    });
  }

  onSubmit(): void {
    console.log('Form submission started');
    console.log('Form valid:', this.form.valid);
    console.log('Form value:', this.form.value);
    console.log('List slug from data:', this.data?.listSlug);
    console.log('List slug from component:', this.listSlug);

    if (this.form.invalid || !this.data?.listSlug || this.isSubmitting) {
      console.log('Form validation failed or already submitting');
      if (!this.data?.listSlug) {
        this.errorMessage = 'Erreur: identifiant de liste manquant';
      }
      this.markFormGroupTouched(this.form);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.form.value;

    // Validate required fields before sending
    if (!formValue.gender || !formValue.profile) {
      this.errorMessage = 'Veuillez sélectionner un genre et un profil';
      this.isSubmitting = false;
      return;
    }

    const personData = {
      list: this.data.listSlug,
      first_name: formValue.first_name?.trim(),
      last_name: formValue.last_name?.trim(),
      gender: formValue.gender,
      age: Number(formValue.age),
      french_level: Number(formValue.french_level),
      tech_level: Number(formValue.tech_level),
      dwwm: Boolean(formValue.dwwm),
      profile: formValue.profile
    };

    console.log('Sending person data:', personData);

    this.listPersonService.addPersonToList(this.data.listSlug, personData).subscribe({
      next: (response) => {
        console.log('Person created successfully:', response);
        this.dialogRef.close('success');
      },
      error: (err) => {
        console.error('Error creating person:', err);
        this.errorMessage = err.message || 'Erreur lors de l\'ajout de la personne';
        this.isSubmitting = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
