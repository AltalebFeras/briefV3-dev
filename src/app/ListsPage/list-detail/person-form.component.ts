import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ListPersonService } from '../../core/services/list-person.service';

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css']
})
export class PersonFormComponent {
  form: FormGroup;
  genderOptions = ['Masculin', 'Féminin', 'Autre'];
  profileOptions = ['Timide', 'Leader', 'Discret', 'Autre']; // ou ce que ton API accepte
  listSlug!: string;
  errorMessage: any;

  constructor(
    private readonly fb: FormBuilder,
    private readonly listPersonService: ListPersonService,
    private readonly dialogRef: MatDialogRef<PersonFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.listSlug = data.listSlug;

    this.form = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      last_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      gender: ['Masculin', Validators.required],
      age: [null, [Validators.required, Validators.min(1), Validators.max(99)]],
      french_level: [1, [Validators.required, Validators.min(1), Validators.max(4)]],
      tech_level: [1, [Validators.required, Validators.min(1), Validators.max(4)]],
      dwwm: [false, Validators.required],
      profile: ['', Validators.required]
    });
  }

onSubmit(): void {
  if (this.form.valid && this.data.listSlug) {
const personData = {
  ...this.form.value,
  age: Number(this.form.value.age),
  french_level: Number(this.form.value.french_level),
  tech_level: Number(this.form.value.tech_level),
  dwwm: Boolean(this.form.value.dwwm)
};
this.listPersonService.addPersonToList(this.data.listSlug, personData).subscribe({
  next: () => this.dialogRef.close('success'),
  error: (err) => {
    console.error('Erreur API:', err);
    this.dialogRef.close('error');
  }
});
  }
}



  onCancel(): void {
    this.dialogRef.close('success');

  }
}
