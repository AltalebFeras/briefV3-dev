import { Person } from './person';
import { GroupDraw } from './group.model';

export interface List {
  id: number;
  name: string;
  description?: string;
  slug: string;
  user_id: number;       // correspond à `id_user` en DB
  is_private: boolean;   // à garder si tu veux filtrer les vues
  created_at?: string;   // Date de création de la liste
  people?: Person[];      // personnes de la liste
  draws?: GroupDraw[];    // historique des tirages
}
