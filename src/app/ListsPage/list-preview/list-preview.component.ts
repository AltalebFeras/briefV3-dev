import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from '../../core/services/list.service';
import { List } from '../../models/list';

@Component({
  selector: 'app-list-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-preview.component.html',
  styleUrls: ['./list-preview.component.scss'],
})
export class ListPreviewComponent implements OnInit {
  list: List | null = null;
  isLoading = true;
  slug!: string;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private listService: ListService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (!slug) {
        this.router.navigate(['/']);
        return;
      }
      this.slug = slug;
      this.loadList();
    });
  }

  loadList(): void {
  this.isLoading = true;

  this.listService.getListBySlug(this.slug).subscribe({
    next: (data) => {
      this.list = data;
      this.isLoading = false;
    },
    error: (err) => {
      this.errorMessage =
        err.message || 'Erreur lors du chargement de la liste.';
      this.isLoading = false;
      this.router.navigate(['/']);
    },
  });
}


  goBack(): void {
    this.router.navigate(['/']);
  }

  login(): void {
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: `/lists/${this.slug}` },
    });
  }
}
