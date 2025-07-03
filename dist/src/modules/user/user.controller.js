"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRole = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const user_service_1 = require("./user.service");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'ADMIN')
            return res.status(403).json({ error: 'Forbidden' });
        const users = yield user_service_1.UserService.getAll();
        res.json(users);
    }
    catch (_b) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield user_service_1.UserService.getById(userId);
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json(user);
    }
    catch (_a) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});
exports.getUserById = getUserById;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = req.params.id;
        const userInDb = yield user_service_1.UserService.getById(userId);
        if (!userInDb)
            return res.status(404).json({ error: 'User not found' });
        // If email is present in request, check it matches DB
        if ('email' in req.body && req.body.email !== userInDb.email) {
            return res.status(400).json({ error: 'Email does not match your current email.' });
        }
        // If password is present in request, check it matches DB
        if ('password' in req.body && req.body.password !== userInDb.password) {
            return res.status(400).json({ error: 'Password does not match your current password.' });
        }
        // Prevent normal users from changing their role
        const userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        if ('role' in req.body &&
            req.body.role !== userInDb.role &&
            userRole !== 'ADMIN' &&
            userRole !== 'SUPER_ADMIN') {
            return res.status(400).json({ error: 'You are not allowed to change your role.' });
        }
        if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN' && 'role' in req.body) {
            delete req.body.role;
        }
        // Remove email and password from update payload
        if ('email' in req.body)
            delete req.body.email;
        if ('password' in req.body)
            delete req.body.password;
        const user = yield user_service_1.UserService.update(userId, req.body);
        res.json(user);
    }
    catch (_b) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});
exports.updateUser = updateUser;
const updateUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const currentUserRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        if (!currentUserRole)
            return res.status(403).json({ error: 'Forbidden' });
        const targetUser = yield user_service_1.UserService.getById(req.params.id);
        if (!targetUser)
            return res.status(404).json({ error: 'User not found' });
        // SUPER_ADMIN can change anyone's role
        if (currentUserRole === 'SUPER_ADMIN') {
            const user = yield user_service_1.UserService.updateRole(req.params.id, req.body);
            return res.json(user);
        }
        // ADMIN can only change USER's role
        if (currentUserRole === 'ADMIN') {
            if (targetUser.role !== 'USER') {
                return res.status(403).json({ error: 'Admin can only change USER roles.' });
            }
            const user = yield user_service_1.UserService.updateRole(req.params.id, req.body);
            return res.json(user);
        }
        // Others cannot change roles
        return res.status(403).json({ error: 'Forbidden' });
    }
    catch (_b) {
        res.status(500).json({ error: 'Failed to update user role' });
    }
});
exports.updateUserRole = updateUserRole;
