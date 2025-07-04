// // src/app/mocks/mock-data.ts
// import { User } from '../models/user.model';
// import { Group } from '../models/group.model';
// import { DrawHistoryEntry } from '../models/draw-history-entry.model';


// // 🧍 Utilisateur simulé
// export const mockUsers: User[] = [
//   {
//     id: 1,
//     first_name: 'Alice',
//     last_name: 'Dupont',
//     email: 'alice@example.com',
//     roles: ['ROLE_USER'],
//     is_verified: true,
//     is_blocked: false,
//     created_at: '2025-06-01T09:00:00Z',
//     updated_at: '2025-06-20T15:00:00Z',
//     cgu_accepted_at: '2025-06-10T10:00:00Z',
//     token: 'mock-token-alice',
//     password: 'password123' // juste pour simuler le login
//   },
//   {
//     id: 2,
//     first_name: 'Admin',
//     last_name: 'Root',
//     email: 'admin@groupformer.com',
//     roles: ['ROLE_ADMIN'],
//     is_verified: true,
//     is_blocked: false,
//     created_at: '2025-01-01T00:00:00Z',
//     updated_at: '2025-05-01T12:00:00Z',
//     cgu_accepted_at: '2025-01-15T00:00:00Z',
//     token: 'mock-token-admin',
//     password: 'admin123'
//   }
// ];



// // 📋 Listes associées à Alice
// export const mockLists = [
//   {
//     id: 101,
//     name: 'Promo Septembre',
//     userId: 1,
//     personnes: [
//       {
//         id: 1,
//         nom: 'Jean',
//         genre: 'masculin',
//         age: 25,
//         ancienDWWM: true,
//         niveauTechnique: 3,
//         profil: 'réservé',
//         aisanceFr: 4
//       },
//       {
//         id: 2,
//         nom: 'Sophie',
//         genre: 'féminin',
//         age: 27,
//         ancienDWWM: false,
//         niveauTechnique: 2,
//         profil: 'à l’aise',
//         aisanceFr: 3
//       },
//       {
//         id: 3,
//         nom: 'Alex',
//         genre: 'ne se prononce pas',
//         age: 30,
//         ancienDWWM: true,
//         niveauTechnique: 4,
//         profil: 'timide',
//         aisanceFr: 2
//       },
//       {
//         id: 4,
//         nom: 'Léa',
//         genre: 'féminin',
//         age: 22,
//         ancienDWWM: false,
//         niveauTechnique: 1,
//         profil: 'à l’aise',
//         aisanceFr: 4
//       }
//     ],
//     tirages: [
//       {
//         id: 201,
//         date: '2025-07-01T10:00:00Z',
//         groupes: [
//           {
//             id: 1,
//             nom: 'Groupe 1',
//             membres: [1, 2]
//           },
//           {
//             id: 2,
//             nom: 'Groupe 2',
//             membres: [3, 4]
//           }
//         ]
//       }
//     ]
//   }
// ];

// export const mockGeneratedGroups: Group[] = [
//   {
//     name: 'Groupe 1',
//     members: [
//       { id: 'p11', name: 'Personne 1' },
//       { id: 'p12', name: 'Personne 2' },
//     ],
//   },
//   {
//     name: 'Groupe 2',
//     members: [{ id: 'p21', name: 'Personne 3' }],
//   }
// ];

// export const mockDrawHistory: DrawHistoryEntry[] = [
//   {
//     id: '1',
//     date: new Date(),
//     numberOfGroups: 2,
//     mixAge: true,
//     mixGender: false,
//     mixDWWM: true,
//     mixLevel: false,
//     groups: mockGeneratedGroups
//   }
// ];