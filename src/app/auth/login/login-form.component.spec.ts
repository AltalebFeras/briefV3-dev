import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginFormComponent } from './login-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginFormComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have required errors on empty fields', () => {
    const emailCtrl = component.loginForm.get('email');
    const passwordCtrl = component.loginForm.get('password');

    emailCtrl?.setValue('');
    emailCtrl?.markAsTouched();
    emailCtrl?.updateValueAndValidity();

    passwordCtrl?.setValue('');
    passwordCtrl?.markAsTouched();
    passwordCtrl?.updateValueAndValidity();

    expect(emailCtrl?.errors?.['required']).toBeTrue();
    expect(passwordCtrl?.errors?.['required']).toBeTrue();
  });

  it('should be valid with correct credentials', () => {
    component.loginForm.setValue({
      email: 'test@mail.com',
      password: '123456'
    });
    expect(component.loginForm.valid).toBeTrue();
  });

  it('should call login on submit', () => {
    authServiceSpy.login.and.returnValue(of({ user: { email: 'test@mail.com' }, token: 'token' }));

    component.loginForm.setValue({
      email: 'test@mail.com',
      password: '123456'
    });

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      identifier: 'test@mail.com',
      password: '123456'
    });
  });

  it('should show error message on login failure', () => {
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Erreur')));

    component.loginForm.setValue({
      email: 'wrong@mail.com',
      password: 'fail'
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Email ou mot de passe incorrect');
  });
});
