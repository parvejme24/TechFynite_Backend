import { Request, Response } from 'express';
import { UserService } from './user.service';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    if ((req as any).user?.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
    const users = await UserService.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await UserService.getById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Only allow self or admin
    if ((req as any).user?.userId !== userId && (req as any).user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    if ((req as any).user?.userId !== userId && (req as any).user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const user = await UserService.update(userId, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    if ((req as any).user?.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
    const user = await UserService.updateRole(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
}; 