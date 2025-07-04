// ✅ people-table.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Person } from '../../models/person';

@Component({
  selector: 'app-people-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './people-table.component.html',
  styleUrls: ['./people-table.component.css']
})
export class PeopleTableComponent {
  @Input() persons: Person[] = [];
  @Output() editPerson = new EventEmitter<Person>();
  @Output() deletePerson = new EventEmitter<Person>();

  ngOnChanges(): void {
  console.log('Persons input:', this.persons);
}

  onEdit(person: Person): void {
    this.editPerson.emit(person);
  }

  onDelete(person: Person): void {
    this.deletePerson.emit(person);
  }

  trackByPersonId(index: number, person: Person): string | number {
  return person.id ?? person.slug ?? index;
}

}
