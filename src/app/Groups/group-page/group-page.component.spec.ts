import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { GroupPageComponent } from './group-page.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GroupService } from '../../core/services/group.service';
import { of, throwError } from 'rxjs';
import { Group, GroupGenerationConfig } from '../../models/group.model';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('GroupPageComponent', () => {
  let component: GroupPageComponent;
  let fixture: ComponentFixture<GroupPageComponent>;

  const mockConfig: GroupGenerationConfig = {
    listSlug: 'mock-list-id',
    numberOfGroups: 2,
    mixGender: true,
    mixAge: false,
    mixDWWM: true,
    mixLevel: false,
  };
  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };
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


  const mockGroupService = {
    generateGroups: jasmine
      .createSpy('generateGroups')
      .and.returnValue(of(mockGroups)),
    validateGroups: jasmine
      .createSpy('validateGroups')
      .and.returnValue(of({ success: true })),
    getDrawHistory: jasmine.createSpy('getDrawHistory').and.returnValue(of([])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupPageComponent, RouterTestingModule],
      providers: [
        provideHttpClient(),
        provideAnimations(),
        {
          provide: MatDialogRef,
          useValue: { close: jasmine.createSpy('close') },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { listId: 'mock-list-id' },
        },
        {
          provide: GroupService,
          useValue: mockGroupService,
        },
        { provide: Router, useValue: mockRouter },
      { provide: GroupService, useValue: mockGroupService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog when close() is called', () => {
    component.close();
    expect(TestBed.inject(MatDialogRef).close).toHaveBeenCalled();
  });

  it('should receive listId from MAT_DIALOG_DATA', () => {
    expect(component.data.listSlug).toBe('mock-list-id');
  });

  it('should call groupService.generateGroups when onGenerate() is called with config', () => {
    component.onGenerate(mockConfig);
    expect(mockGroupService.generateGroups).toHaveBeenCalledWith(mockConfig);
  });

  it('should update groups when onGenerate is called', fakeAsync(() => {
    component.onGenerate(mockConfig);
    tick();
    console.log('groups:', component.groups());
    expect(component.groups()).toEqual(mockGroups);
  }));

  it('should handle errors when group generation fails', fakeAsync(() => {
    const consoleSpy = spyOn(console, 'error');

    mockGroupService.generateGroups.and.returnValue(
      throwError(() => new Error('Erreur simulée'))
    );

    component.onGenerate(mockConfig);
    tick();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Erreur lors de la génération des groupes ❌',
      jasmine.any(Error)
    );
    expect(component.groups()).toEqual([]);
  }));

  it('should call validateGroups on handleValidateAndRedirect()', fakeAsync(() => {
    component.handleValidateAndRedirect(mockGroups);
    tick();
    expect(mockGroupService.validateGroups).toHaveBeenCalledWith(mockGroups);
  }));

  it('should log error on validateGroups failure', fakeAsync(() => {
    const consoleSpy = spyOn(console, 'error');
    mockGroupService.validateGroups.and.returnValue(
      throwError(() => new Error('Erreur de validation'))
    );

    component.handleValidateAndRedirect(mockGroups);
    tick();

    expect(consoleSpy).toHaveBeenCalledWith(
      "Erreur lors de l'enregistrement des groupes ❌",
      jasmine.any(Error)
    );
  }));
  it('should navigate to /draw-history on successful validation', fakeAsync(() => {
  component.handleValidateAndRedirect(mockGroups);
  tick();
  tick();
  expect(mockRouter.navigate).toHaveBeenCalledWith(['/draw-history']);
}));

});
