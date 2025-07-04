import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { SignupModalComponent } from '../register/signup-modal.component';
import { LoginFormComponent } from '../login/login-form.component';
import { By } from '@angular/platform-browser';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);

    await TestBed.configureTestingModule({
      imports: [HomePageComponent, LoginFormComponent, SignupModalComponent],
      providers: [
        { provide: HttpClient, useValue: httpSpy },
        { provide: AuthService, useClass: AuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait ouvrir la modale quand on appelle openModal()', () => {
    component.openModal();
    expect(component.isModalOpen).toBeTrue();
  });

  it('devrait fermer la modale quand on appelle closeModal()', () => {
    component.isModalOpen = true;
    component.closeModal();
    expect(component.isModalOpen).toBeFalse();
  });

  it('devrait afficher la modale si isModalOpen est true', () => {
    component.isModalOpen = true;
    fixture.detectChanges();

    const modal = fixture.debugElement.query(By.css('app-signup-modal'));
    expect(modal).toBeTruthy();
  });

  it('ne doit pas afficher la modale si isModalOpen est false', () => {
    component.isModalOpen = false;
    fixture.detectChanges();

    const modal = fixture.debugElement.query(By.css('app-signup-modal'));
    expect(modal).toBeFalsy();
  });
});
