import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupGenerationConfig } from '../../models/group.model';

@Component({
  selector: 'app-group-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.css'],
})
export class GroupFormComponent {
  numberOfGroups = 2;

  mixAge = false;
  mixDWWM = false;
  mixGender = false;
  mixLevel = false;

  @Output() generate = new EventEmitter<GroupGenerationConfig>();

  onSubmit(): void {
    this.generate.emit({
      listSlug: '', // à compléter plus tard
      numberOfGroups: this.numberOfGroups,
      mixAge: this.mixAge,
      mixDWWM: this.mixDWWM,
      mixGender: this.mixGender,
      mixLevel: this.mixLevel,
    });
  }
}
