import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupFormComponent } from './group-form.component';
import { GroupGenerationConfig } from '../../models/group.model';

describe('GroupFormComponent', () => {
  let component: GroupFormComponent;
  let fixture: ComponentFixture<GroupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupFormComponent], // standalone
    }).compileComponents();

    fixture = TestBed.createComponent(GroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit config when onSubmit is called', () => {
    spyOn(component.generate, 'emit');

    component.numberOfGroups = 3;
    component.mixAge = true;
    component.mixDWWM = false;
    component.mixGender = true;
    component.mixLevel = false;

    component.onSubmit();

    const expectedConfig: GroupGenerationConfig = {
     listSlug: '', // inchangé ici
      numberOfGroups: 3,
      mixAge: true,
      mixDWWM: false,
      mixGender: true,
      mixLevel: false,
    };

    expect(component.generate.emit).toHaveBeenCalledWith(expectedConfig);
  });

  it('should use default values', () => {
    expect(component.numberOfGroups).toBe(2);
    expect(component.mixAge).toBeFalse();
    expect(component.mixDWWM).toBeFalse();
    expect(component.mixGender).toBeFalse();
    expect(component.mixLevel).toBeFalse();
  });
});
