import { Request, Response } from "express";
import { UserService } from "./user.service";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    if ((req as any).user?.role !== "ADMIN")
      return res.status(403).json({ error: "Forbidden" });
    const users = await UserService.getAll();
    res.json(users);
  } catch {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await UserService.getById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const userInDb = await UserService.getById(userId);
    if (!userInDb) return res.status(404).json({ error: "User not found" });

    // If email is present in request, check it matches DB
    if ("email" in req.body && req.body.email !== userInDb.email) {
      return res
        .status(400)
        .json({ error: "Email does not match your current email." });
    }
    // If password is present in request, check it matches DB
    if ("password" in req.body && req.body.password !== userInDb.password) {
      return res
        .status(400)
        .json({ error: "Password does not match your current password." });
    }
    // Prevent normal users from changing their role
    const userRole = (req as any).user?.role;
    if (
      "role" in req.body &&
      req.body.role !== userInDb.role &&
      userRole !== "ADMIN" &&
      userRole !== "SUPER_ADMIN"
    ) {
      return res
        .status(400)
        .json({ error: "You are not allowed to change your role." });
    }
    if (
      userRole !== "ADMIN" &&
      userRole !== "SUPER_ADMIN" &&
      "role" in req.body
    ) {
      delete req.body.role;
    }
    // Remove email and password from update payload
    if ("email" in req.body) delete req.body.email;
    if ("password" in req.body) delete req.body.password;

    const user = await UserService.update(userId, req.body);
    res.json(user);
  } catch {
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const currentUser = (req as any).user;
    const currentUserRole = currentUser?.role;
    if (!currentUserRole) {
      return res.status(403).json({ error: "Forbidden: No current user role found." });
    }

    if (currentUserRole === "USER") {
      return res.status(403).json({ error: "User role cannot change any roles." });
    }

    // Only ADMIN or SUPER_ADMIN can change roles
    const targetUser = await UserService.getById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ error: "User not found." });
    }

    // Prevent changing own role (optional, can be removed if not needed)
    if (currentUser.id === targetUser.id) {
      return res.status(403).json({ error: "You cannot change your own role." });
    }

    // ADMIN and SUPER_ADMIN can change any role
    const user = await UserService.updateRole(req.params.id, req.body);
    return res.json(user);
  } catch (err) {
    res.status(500).json({
      error: "Failed to update user role",
      details: err instanceof Error ? err.message : err,
    });
  }
};
