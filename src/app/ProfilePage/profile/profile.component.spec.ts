import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { ProfileService } from '../../core/services/profile.service';
import { of } from 'rxjs';
import { User } from '../../models/user.model';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [{ provide: ProfileService, useValue: profilServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const mockUser: User = {
    first_name: 'Testy',
    last_name: 'McTestface',
    email: 'test@example.com',
    created_at: new Date('2023-01-01'),
    cgu_accepted_at: new Date('2023-01-01'),
  };

  const profilServiceMock = {
    getUser: () => of(mockUser),
    updateUser: (updated: User) => of(updated),
    deleteUser: () => of(),
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the user firstname', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    // Vérifie que le prénom s'affiche bien dans le HTML
    expect(compiled.textContent).toContain('Testy');
  });

  it('should display the form after toggling edit mode', () => {
    // On active le mode édition
    component.toggleEditMode();
    fixture.detectChanges(); // Mise à jour de la vue liée à la modification du signal

    // On vérifie qu’un input (du formulaire) est présent
    const compiled = fixture.nativeElement as HTMLElement;
    const input =
      compiled.querySelector('input[name="firstname"]') ||
      compiled.querySelector('input');

    expect(input).toBeTruthy();
  });

  it('should call updateUser and exit edit mode on save()', () => {
    const spy = spyOn(profilServiceMock, 'updateUser').and.callThrough();

    component.toggleEditMode(); // Passe en mode édition
    fixture.detectChanges();

    // Simule une modification de valeur dans le formulaire
    component.profileForm.setValue({
      firstname: 'Updated',
      lastname: 'McTestface',
    });

    component.save(); // Appelle la méthode
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled(); // Appel du service
    expect(component.editMode()).toBeFalse(); // Retour en mode lecture
    expect(component.user.first_name).toBe('Updated'); // Donnée modifiée localement
  });

  it('should call deleteUser when user confirms deletion', () => {
  // Force la confirmation du popup
  spyOn(window, 'confirm').and.returnValue(true);
  const spy = spyOn(profilServiceMock, 'deleteUser').and.callThrough();

  component.confirmDelete();
  fixture.detectChanges();

  expect(spy).toHaveBeenCalled(); // Suppression appelée
});

});
