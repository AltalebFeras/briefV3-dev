import { Component, Input } from '@angular/core';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Group } from '../../models/group.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-group-display',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule],
  templateUrl: './group-display.component.html',
  styleUrls: ['./group-display.component.css'],
})
export class GroupDisplayComponent {
  /**
   * Liste des groupes à afficher, reçue du parent.
   * Chaque groupe contient un nom et une liste de membres.
   */
  @Input() groups!: Group[];

  /**
   * Indique si les groupes ont été validés (bloque l'édition des noms).
   */
  @Input() isValidated = false;

  /**
   * Identifiants uniques pour chaque zone de drag & drop,
   * pour lier les listes entre elles.
   */
  get dropListIds(): string[] {
    return this.groups.map((_, i) => `group-${i}`);
  }

  /**
   * Gestion du drag & drop.
   * Si même container, réordonne les membres.
   * Sinon, déplace entre groupes différents.
   */
  onDrop(event: CdkDragDrop<any[]>, targetIndex: number): void {
    const groups = this.groups;

    if (event.previousContainer === event.container) {
      moveItemInArray(
        groups[targetIndex].members,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const sourceIndex = groups.findIndex(
        (g) => g.members === event.previousContainer.data
      );
      transferArrayItem(
        groups[sourceIndex].members,
        groups[targetIndex].members,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
