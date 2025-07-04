import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupModalComponent } from './signup-modal.component';

import { of, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

describe('SignupModalComponent', () => {
  let component: SignupModalComponent;
  let fixture: ComponentFixture<SignupModalComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [SignupModalComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait être invalide quand le formulaire est vide', () => {
    expect(component.signupForm.valid).toBeFalse();
  });

  it('devrait être valide avec des valeurs correctes', () => {
    component.signupForm.setValue({
      email: 'test@mail.com',
      emailConfirm: 'test@mail.com',
      password: '123456',
      passwordConfirm: '123456',
      firstName: 'Test',
      lastName: 'User'
    });
    expect(component.signupForm.valid).toBeTrue();
  });

  it('devrait afficher un message de succès si register() fonctionne', () => {
    authServiceSpy.register.and.returnValue(of({
      email: 'test@mail.com',
      emailConfirmed: false
    }));

    component.signupForm.setValue({
      email: 'test@mail.com',
      emailConfirm: 'test@mail.com',
      password: '123456',
      passwordConfirm: '123456',
      firstName: 'Test',
      lastName: 'User'
    });

    component.onSubmit();

    expect(component.successMessage).toContain('Inscription réussie');
  });

  it('devrait afficher un message d\'erreur si register() échoue', () => {
    authServiceSpy.register.and.returnValue(throwError(() => new Error('Email déjà utilisé')));

    component.signupForm.setValue({
      email: 'test@mail.com',
      emailConfirm: 'test@mail.com',
      password: '123456',
      passwordConfirm: '123456',
      firstName: 'Test',
      lastName: 'User'
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Email déjà utilisé');
  });

  it('devrait émettre un événement close quand onClose() est appelé', () => {
    spyOn(component.close, 'emit');
    component.onClose();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('devrait émettre close après une inscription réussie', () => {
    spyOn(component.close, 'emit');
    authServiceSpy.register.and.returnValue(of({
      email: 'test@mail.com',
      emailConfirmed: false
    }));

    component.signupForm.setValue({
      email: 'test@mail.com',
      emailConfirm: 'test@mail.com',
      password: '123456',
      passwordConfirm: '123456',
      firstName: 'Test',
      lastName: 'User'
    });

    component.onSubmit();

    expect(component.close.emit).toHaveBeenCalled();
  });

  it('devrait être invalide si les emails ne correspondent pas', () => {
    component.signupForm.setValue({
      email: 'test@mail.com',
      emailConfirm: 'wrong@mail.com',
      password: '123456',
      passwordConfirm: '123456',
      firstName: 'Test',
      lastName: 'User'
    });

    expect(component.signupForm.valid).toBeFalse();
    expect(component.signupForm.errors?.['emailMismatch']).toBeTrue();
  });

  it('devrait être invalide si les mots de passe ne correspondent pas', () => {
    component.signupForm.setValue({
      email: 'test@mail.com',
      emailConfirm: 'test@mail.com',
      password: '123456',
      passwordConfirm: 'abcdef',
      firstName: 'Test',
      lastName: 'User'
    });

    expect(component.signupForm.valid).toBeFalse();
    expect(component.signupForm.errors?.['passwordMismatch']).toBeTrue();
  });
});
