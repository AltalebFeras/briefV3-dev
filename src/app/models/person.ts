export enum Gender {
  MALE = 'Masculin',
  FEMALE = 'Féminin',
  OTHER = 'Autre',
}

export enum Profile {
  SHY = 'Timide',
  RESERVED = 'Réservé',
  COMFORTABLE = 'À l\'aise',
  LEADER = 'Leader',
  DISCRETE = 'Discret',
}

export interface Person {
  id?: number;
  first_name: string;
  last_name: string;
  age: number;
  gender: Gender | string;
  french_level: number;     // 1 to 4
  tech_level: number;       // 1 to 4
  dwwm: boolean;
  profile: Profile | string;
  slug?: string;
  liste_id?: number;
  liste?: {
    name: string;
    description?: string;
    slug: string;
  };
}
