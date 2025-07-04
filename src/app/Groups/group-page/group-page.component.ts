import { Component, inject, signal, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupFormComponent } from '../group-form/group-form.component';
import { GroupGenerationConfig, Group, DrawResponse } from '../../models/group.model';
import { GroupService } from '../../core/services/group.service';
import { GroupDisplayComponent } from '../group-display/group-display.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-page',
  standalone: true,
  imports: [CommonModule, GroupFormComponent, GroupDisplayComponent],
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.css'],
})
export class GroupPageComponent {
  constructor(
    @Optional() private dialogRef: MatDialogRef<GroupPageComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { listSlug: string }
  ) {}

  groups = signal<Group[]>([]);
  loading = signal(false);
  isValidated = signal(false);
  errorMessage = signal<string | null>(null);

  private groupservice = inject(GroupService);
  private router = inject(Router);

  onGenerate(config: GroupGenerationConfig): void {
  this.groupservice.createDraw(config).subscribe({
    next: (response: DrawResponse) => {
      if (response.success && response.data) {
        this.groups.set(response.data.groups);
      } else {
        this.groups.set([]);
        this.errorMessage.set(response.message || 'Erreur lors de la création du tirage');
      }
    },
    error: (error) => {
      this.groups.set([]);
      this.errorMessage.set('Erreur réseau lors de la génération du tirage');
      console.error(error);
    }
  });
}


  handleValidateAndRedirect(groupsFinal: Group[]): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.errorMessage.set(null);

    this.groupservice.confirmDraw(groupsFinal).subscribe({
      next: () => {
        this.isValidated.set(true);

        this.groupservice.fetchDrawHistory().subscribe({
          next: () => {
            this.loading.set(false);
            this.router.navigate(['/draw-history']);
            if (this.dialogRef) {
              this.dialogRef.close();
            }
          },
          error: (error) => {
            this.loading.set(false);
            this.errorMessage.set('Erreur lors du chargement de l’historique');
            console.error(error);
          }
        });
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set("Erreur lors de l'enregistrement des groupes");
        console.error(error);
      }
    });
  }

  close(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
