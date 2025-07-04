import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListsUserComponent } from './lists.component';

describe('ListsComponent', () => {
  let component: ListsUserComponent;
  let fixture: ComponentFixture<ListsUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListsUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListsUserComponent);
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

