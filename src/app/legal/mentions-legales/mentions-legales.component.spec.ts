import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MentionsLegalesComponent } from './mentions-legales.component';

describe('MentionsLegalesComponent', () => {
  let component: MentionsLegalesComponent;
  let fixture: ComponentFixture<MentionsLegalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentionsLegalesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MentionsLegalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title "Mentions légales"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Mentions légales');
  });

  it('should contain a section about cookies', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Cookies');
  });
});
