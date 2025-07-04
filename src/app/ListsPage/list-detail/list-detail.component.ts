import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ListService } from '../../core/services/list.service';
import { ListPersonService } from '../../core/services/list-person.service';
import { DrawService } from '../../core/services/draw.service';
import { List } from '../../models/list';
import { Person } from '../../models/person';
import { DrawListItem, DrawDetails } from '../../models/draw.model';
import { PersonFormComponent } from './person-form.component';
import { PeopleTableComponent } from './people-table.component';

@Component({
  selector: 'app-list-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PeopleTableComponent],
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.css'],
})
export class ListDetailComponent implements OnInit {
  list: List | undefined;
  listSlug!: string;
  isLoading = true;
  errorMessage = '';

  // Draw-related properties
  draws: DrawListItem[] = [];
  selectedDraw: DrawDetails | null = null;
  drawForm: FormGroup;
  isCreatingDraw = false;
  showDrawForm = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly listService: ListService,
    private readonly listPersonService: ListPersonService,
    private readonly drawService: DrawService
  ) {
    this.drawForm = this.fb.group({
      number_of_groups: [2, [Validators.required, Validators.min(2)]],
      draw_name: [''],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (!slug) {
        this.router.navigate(['/lists']);
        return;
      }
      this.listSlug = slug;
      this.loadList();
      this.loadDraws();
    });
  }

  loadList(): void {
    this.isLoading = true;

    this.listService.getListBySlug(this.listSlug).subscribe({
      next: (data) => {
        console.log('List data received:', data); // Debug log
        this.list = data;
        if (this.list) {
          this.list.people = this.list.people ?? [];
          // Ensure slug is set from the URL parameter if missing
          if (!this.list.slug) {
            this.list.slug = this.listSlug;
          }
        }

        this.listPersonService.getPersonsByListSlug(this.listSlug).subscribe({
          next: (persons) => {
            console.log('Persons received:', persons); // Debug log
            if (this.list) {
              this.list.people = persons;
            }
            this.isLoading = false;
          },
          error: (err) => {
            console.warn('Aucune personne trouvée:', err.message);
            if (this.list) {
              this.list.people = [];
            }
            this.isLoading = false;
          },
        });
      },
      error: (err) => {
        this.errorMessage = err.message || 'Erreur chargement liste';
        this.router.navigate(['/lists']);
        this.isLoading = false;
      },
    });
  }

  loadDraws(): void {
    this.drawService.getAllDrawsForList(this.listSlug).subscribe({
      next: (response) => {
        this.draws = response.data || [];
      },
      error: (err) => {
        console.warn('Aucun tirage trouvé:', err.message);
        this.draws = [];
      },
    });
  }

  togglePersonForm(): void {
    console.log('Opening person form dialog');
    console.log('List data:', this.list);
    console.log('List slug from component:', this.listSlug);

    // Use the component's listSlug instead of relying on list.slug
    const slugToUse = this.list?.slug || this.listSlug;

    if (!slugToUse) {
      this.errorMessage = 'Impossible d\'ouvrir le formulaire - slug de liste manquant';
      console.error('No slug available:', { listSlug: this.listSlug, listObject: this.list });
      return;
    }

    const dialogRef = this.dialog.open(PersonFormComponent, {
      width: '90vw',
      maxWidth: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      disableClose: false,
      data: {
        listSlug: slugToUse,
        listId: this.list?.id,
      },
    });

    console.log('Dialog opened with data:', {
      listSlug: slugToUse,
      listId: this.list?.id,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog closed with result:', result);
      if (result === 'success') {
        console.log('Person added successfully, reloading list');
        this.loadList();
      }
    });
  }

  deletePerson(person: Person): void {
    if (!person.slug) {
      this.errorMessage = 'Impossible de supprimer cette personne - slug manquant';
      return;
    }

    this.listPersonService.deletePerson(person.slug).subscribe({
      next: () => {
        this.loadList();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Erreur lors de la suppression';
      },
    });
  }

  toggleDrawForm(): void {
    this.showDrawForm = !this.showDrawForm;
    if (this.showDrawForm) {
      this.drawForm.reset({ number_of_groups: 2, draw_name: '' });
      this.errorMessage = '';
    }
  }

  createDraw(): void {
    if (this.drawForm.invalid || this.isCreatingDraw) return;

    if (!this.list?.people || this.list.people.length < 2) {
      this.errorMessage = 'Il faut au moins 2 personnes pour créer un tirage';
      return;
    }

    const numberOfGroups = this.drawForm.value.number_of_groups;
    if (numberOfGroups > this.list.people.length) {
      this.errorMessage = `Impossible de créer ${numberOfGroups} groupes avec seulement ${this.list.people.length} personne(s)`;
      return;
    }

    this.isCreatingDraw = true;
    this.errorMessage = '';

    const request = {
      list_slug: this.listSlug,
      number_of_groups: numberOfGroups,
      draw_name: this.drawForm.value.draw_name?.trim() || undefined,
    };

    this.drawService.createDraw(request).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.selectedDraw = response.data;
          this.loadDraws();
          this.toggleDrawForm();
        }
        this.isCreatingDraw = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Erreur lors de la création du tirage';
        this.isCreatingDraw = false;
      },
    });
  }

  viewDraw(drawName: string): void {
    this.drawService.getDrawDetails(drawName).subscribe({
      next: (response) => {
        this.selectedDraw = response.data;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Erreur lors du chargement du tirage';
      },
    });
  }

  closeDraw(): void {
    this.selectedDraw = null;
  }

  goBack(): void {
    this.router.navigate(['/lists']);
  }
}
