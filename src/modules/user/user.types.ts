export interface UpdateUserRequest {
  displayName?: string;
  photoUrl?: string;
  designation?: string;
  phone?: string;
  country?: string;
  city?: string;
  stateOrRegion?: string;
  postCode?: string;
}

export interface UpdateUserRoleRequest {
  role: 'USER' | 'ADMIN';
} 