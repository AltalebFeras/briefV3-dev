// Représente une personne dans un groupe
export interface Person {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  age: number;
  dwwm: boolean;
  profile: string;
  french_level: number;
  tech_level: number;
}


// Groupe généré ou tiré
export interface Group {
  id?: number;              // utilisé pour les groupes enregistrés
  name: string;
  members: Person[];        // on normalise autour de `members`
}

// Tirage complet, stocké dans l’historique, et retourné par l’API
export interface GroupDraw {
  id: number;
  date: string;          // Date du tirage
  listId: number;
  groups: Group[];
  criteria: MixCriteria;
}

// Configuration envoyée au backend pour créer un tirage
export interface GroupGenerationConfig {
  listSlug: string;         // Slug de la liste ciblée
  drawName?: string;        // Nom optionnel du tirage
  numberOfGroups: number;
  mixAge: boolean;
  mixDWWM: boolean;
  mixGender: boolean;
  mixLevel: boolean;
  mixProfile?: boolean;
  mixFrenchFluency?: boolean;
}

// Critères utilisés lors d’un tirage
export interface MixCriteria {
  mixGender: boolean;
  mixFrenchFluency: boolean;
  mixDWWM: boolean;
  mixLevel: boolean;
  mixProfile: boolean;
  mixAge: boolean;
}

// Réponse du backend à la création d’un tirage
export interface DrawResponse {
  success: boolean;
  message: string;
  token?: string;         // Token JWT rafraîchi
  data?: GroupDraw;       // Tirage créé avec groupes, critères, etc.
}