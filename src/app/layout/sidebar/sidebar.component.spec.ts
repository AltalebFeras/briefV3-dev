import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { AuthService } from '../../auth/auth.service';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['getCurrentUserRole']);

    TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [{ provide: AuthService, useValue: spy }],
    });

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(
      AuthService
    ) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set userRole from AuthService (admin)', () => {
    mockAuthService.getCurrentUserRole.and.returnValue('admin');
    component.ngOnInit();
    expect(component.userRole).toBe('admin');
    expect(component.isAdmin()).toBeTrue();
  });

  it('should set userRole from AuthService (user)', () => {
    mockAuthService.getCurrentUserRole.and.returnValue('user');
    component.ngOnInit();
    expect(component.userRole).toBe('user');
    expect(component.isAdmin()).toBeFalse();
  });

  it('should toggle sidebar visibility', () => {
    expect(component.isOpen()).toBeFalse();
    component.toggleSidebar();
    expect(component.isOpen()).toBeTrue();
    component.toggleSidebar();
    expect(component.isOpen()).toBeFalse();
  });

  it('should close sidebar', () => {
    component.isOpen.set(true); // force à ouvert
    component.closeSidebar();
    expect(component.isOpen()).toBeFalse();
  });

  it('should log out when logout() is called', () => {
    spyOn(console, 'log');
    component.logout();
    expect(console.log).toHaveBeenCalledWith('Déconnexion');
  });

  it('should open sidebar automatically on desktop screens (>= 768px)', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(1024); // simulate desktop
    mockAuthService.getCurrentUserRole.and.returnValue('user');

    component.ngOnInit();
    expect(component.isOpen()).toBeTrue();
  });

  it('should keep sidebar closed by default on mobile screens (< 768px)', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(500); // simulate mobile
    mockAuthService.getCurrentUserRole.and.returnValue('user');

    component.ngOnInit();
    expect(component.isOpen()).toBeFalse();
  });
});
