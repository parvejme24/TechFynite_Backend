export interface UpdateUserRoleRequest {
  role: string;
}

export interface UpdateUserRequest {
  displayName?: string;
  phone?: string;
  country?: string;
  city?: string;
  stateOrRegion?: string;
  postCode?: string;
  designation?: string;
  photoUrl?: string;
}

export interface UserResponse {
  id: string;
  displayName: string;
  email: string;
  photoUrl?: string;
  designation?: string;
  role: string;
  phone?: string;
  country?: string;
  city?: string;
  stateOrRegion?: string;
  postCode?: string;
  balance: number;
  isVerified: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}
