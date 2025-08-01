import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.login(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const result = await AuthService.refreshToken(refreshToken);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const resetPasswordRequest = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await AuthService.resetPasswordRequest(email);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.resetPassword(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // Assume userId is available in req.user (set by auth middleware)
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const result = await AuthService.logout(userId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const user = await AuthService.getCurrentUser(userId);
    res.json({ user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
