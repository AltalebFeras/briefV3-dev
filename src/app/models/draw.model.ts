export interface DrawPerson {
  first_name: string;
  last_name: string;
}

export interface DrawGroup {
  name: string;
  persons: DrawPerson[];
  persons_count: number;
}

export interface DrawDetails {
  groups: DrawGroup[];
  groups_count: number;
  total_persons?: number;
  draw_name?: string;
  created_at?: string;
}

export interface DrawListItem {
  id: number;
  name: string;
  createdAt: string;
}

export interface CreateDrawRequest {
  list_slug: string;
  number_of_groups: number;
  draw_name?: string;
}

export interface DrawResponse {
  success: boolean;
  message?: string;
  token?: string;
  data?: DrawDetails;
}

export interface DrawListResponse {
  success: boolean;
  token?: string;
  data: DrawListItem[];
}

export interface DrawDetailResponse {
  success: boolean;
  token?: string;
  data: DrawDetails;
}
