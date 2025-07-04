import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupDisplayComponent } from './group-display.component';
import { Group } from '../../models/group.model';

describe('GroupDisplayComponent', () => {
  let component: GroupDisplayComponent;
  let fixture: ComponentFixture<GroupDisplayComponent>;

  const mockGroups: Group[] = [
  {
    name: 'Groupe 1',
    members: [
      {
        id: '1',
        first_name: 'Alice',
        last_name: 'Dupont',
        gender: 'Féminin',
        age: 25,
        dwwm: true,
        profile: 'Leader',
        french_level: 3,
        tech_level: 4,
      },
    ],
  },
  {
    name: 'Groupe 2',
    members: [
      {
        id: '2',
        first_name: 'Bob',
        last_name: 'Martin',
        gender: 'Masculin',
        age: 30,
        dwwm: false,
        profile: 'Discret',
        french_level: 2,
        tech_level: 3,
      },
    ],
  },
];


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupDisplayComponent], // ✅ standalone
    }).compileComponents();

    fixture = TestBed.createComponent(GroupDisplayComponent);
    component = fixture.componentInstance;
    component.groups = structuredClone(mockGroups); // important pour éviter les effets de bord
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct dropListIds', () => {
    const ids = component.dropListIds;
    expect(ids).toEqual(['group-0', 'group-1']);
  });

 it('should move item in same container (onDrop)', () => {
  const event = {
    previousIndex: 0,
    currentIndex: 0,
    previousContainer: { data: component.groups[0].members },
    container: { data: component.groups[0].members },
  } as any;

  expect(() => component.onDrop(event, 0)).not.toThrow();
});

it('should transfer item between containers (onDrop)', () => {
  const event = {
    previousIndex: 0,
    currentIndex: 0,
    previousContainer: { data: component.groups[0].members },
    container: { data: component.groups[1].members },
  } as any;

  expect(() => component.onDrop(event, 1)).not.toThrow();
});

});
