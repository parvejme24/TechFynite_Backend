import { UserModel } from './user.model';
import { UpdateUserRequest, UpdateUserRoleRequest } from './user.types';

export const UserService = {
  getAll: () => UserModel.findAll(),
  getById: (id: string) => UserModel.findById(id),
  update: (id: string, data: UpdateUserRequest) => UserModel.update(id, data),
  updateRole: (id: string, data: UpdateUserRoleRequest) => UserModel.updateRole(id, data.role),
}; 