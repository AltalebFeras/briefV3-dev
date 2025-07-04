// import { TestBed } from '@angular/core/testing';
// import { GroupService } from './group.service';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { GroupGenerationConfig, Group } from '../models/group.model';


// describe('GroupService (mock mode)', () => {
//   let service: GroupService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [GroupService],
//     });

//     service = TestBed.inject(GroupService);
//     // Force le mode mock même si on change la classe plus tard
//     (service as any).isMock = true;
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should generate mock groups with correct count and names', (done) => {
//     const config: GroupGenerationConfig = {
//       listId: 'abc',
//       numberOfGroups: 3,
//       mixAge: false,
//       mixDWWM: false,
//       mixGender: false,
//       mixLevel: false,
//     };

//     service.generateGroups(config).subscribe((groups: Group[]) => {
//       expect(groups.length).toBe(3);
//       expect(groups[0].name).toBe('Groupe 1');
//       expect(groups[0].members.length).toBe(2);
//       done();
//     });
//   });

//   it('should return mock success when validating groups', (done) => {
//     const mockGroups: Group[] = [
//       { name: 'Groupe A', members: [{ id: '1', name: 'Alice' }] },
//     ];

//     service.validateGroups(mockGroups).subscribe((result) => {
//       expect(result.success).toBeTrue();
//       done();
//     });
//   });
// });
