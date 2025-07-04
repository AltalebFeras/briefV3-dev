export enum Gender {
  MALE = 'masculin',
  FEMALE = 'féminin',
  NOT_SPECIFIED = 'ne se prononce pas',
  Other = "Other",
}

export enum Profile {
  SHY = 'timide',
  RESERVED = 'réservé',
  COMFORTABLE = "à l'aise",
  Other = "Other",
}

export interface Person {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  gender: Gender;
  french_level: number;     // 0 < N < 5
  tech_level: number;       // 0 < N < 5
  dwwm: boolean;
  profile: Profile;
  slug: string;
  liste_id: number;
}
