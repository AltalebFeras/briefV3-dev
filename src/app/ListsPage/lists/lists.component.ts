import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ListService } from '../../core/services/list.service';
import { List } from '../../models/list';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
})
export class ListsUserComponent implements OnInit {
  lists: List[] = [];
  newListForm!: FormGroup;
  showNewListForm = false;
  errorMessage = '';
  isLoading = true;

  constructor(
    private listService: ListService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLists();
    this.newListForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
    });
  }

  loadLists(): void {
    this.isLoading = true;
    this.listService.getAllLists().subscribe({
      next: (lists) => {
          console.log('Listes chargées :', lists); // ⬅️ utile pour traquer les données fantômes
        this.lists = lists;
        this.isLoading = false;
      },
      error: (err) => {
        this.lists = []; // Vide les listes locales
        this.errorMessage =
          err.message || 'Erreur lors du chargement des listes.';
        this.isLoading = false;
      },
    });
  }
  toggleNewListForm(): void {
    this.showNewListForm = !this.showNewListForm;
    if (this.showNewListForm) {
      this.newListForm.reset();
      this.errorMessage = '';
    }
  }

  onSubmit(): void {
    if (this.newListForm.invalid) return;

    const payload = {
  name: this.newListForm.controls['name'].value.trim()
};


    this.listService.createList(payload).subscribe({
      next: (success) => {
        if (success) {
          this.loadLists();
          this.toggleNewListForm();
        } else {
          this.errorMessage = 'Erreur lors de la création de la liste.';
        }
      },
      error: (err) => {
        this.errorMessage = err?.message || 'Erreur réseau.';
      },
    });
  }

  viewList(slug: string): void {
    this.router.navigate(['/lists', slug]);
  }

  deleteList(event: Event, listSlug: string): void {
    event.stopPropagation();

    if (confirm('Supprimer cette liste ?')) {
      this.listService.deleteList(listSlug).subscribe({
        next: (success) => {
          if (success) {
            this.loadLists(); // rafraichir la page pour ne pas voir les listes fantômes
          } else {
            this.errorMessage = 'Échec de la suppression de la liste.';
          }
        },
        error: (err) => {
          this.errorMessage = err?.message || 'Erreur lors de la suppression.';
        },
      });
    }
  }
}
