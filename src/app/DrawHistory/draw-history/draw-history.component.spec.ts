import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DrawHistoryComponent } from './draw-history.component';
import { of, throwError } from 'rxjs';
import { DrawHistoryEntry } from '../../models/draw-history-entry.model';
import { GroupService } from '../../core/services/group.service';

describe('DrawHistoryComponent', () => {
  let component: DrawHistoryComponent;
  let fixture: ComponentFixture<DrawHistoryComponent>;

  const mockHistory: DrawHistoryEntry[] = [
    {
      id: '1',
      date: new Date(),
      numberOfGroups: 2,
      mixAge: true,
      mixGender: false,
      mixDWWM: true,
      mixLevel: false,
      groups: [
        { name: 'Groupe 1', members: [{ id: 'p1', name: 'Alice' }] },
        { name: 'Groupe 2', members: [{ id: 'p2', name: 'Bob' }] },
      ],
    },
  ];

  const mockGroupService = {
  getDrawHistory: jasmine.createSpy('getDrawHistory').and.returnValue(of(mockHistory)),
};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawHistoryComponent],
      providers: [
        { provide: GroupService, useValue: mockGroupService}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DrawHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load history on init', () => {
  expect(mockGroupService.getDrawHistory).toHaveBeenCalled();
  expect(component.history()).toEqual(mockHistory);
});


  it('should set selectedEntry on selectEntry call', () => {
    component.selectEntry(mockHistory[0]);
    expect(component.selectedEntry()).toEqual(mockHistory[0]);
  });

  it('should clear selectedEntry on closeDetails call', () => {
    component.selectEntry(mockHistory[0]);
    component.closeDetails();
    expect(component.selectedEntry()).toBeNull();
  });

  it('should log error when loadHistory fails', fakeAsync(() => {
    const consoleSpy = spyOn(console, 'error');
    mockGroupService.getDrawHistory.and.returnValue(throwError(() => new Error('Load error')));

    component.loadHistory();
    tick();

    expect(consoleSpy).toHaveBeenCalledWith('Erreur chargement historique', jasmine.any(Error));
  }));
});
