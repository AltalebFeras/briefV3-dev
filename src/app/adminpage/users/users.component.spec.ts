import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersComponent } from './users.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ListsComponent } from '../lists/lists.component';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
  imports: [ListsComponent], // ou UsersComponent
  providers: [
    provideHttpClient(withInterceptorsFromDi()) // ✅
  ]
}).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
function compileComponents() {
  throw new Error('Function not implemented.');
}

