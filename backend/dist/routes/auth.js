"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("@/controllers/authController");
const auth_1 = require("@/middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', authController_1.validateRegister, authController_1.register);
router.post('/login', authController_1.validateLogin, authController_1.login);
router.post('/refresh', authController_1.refreshToken);
router.post('/logout', authController_1.logout);
// Google OAuth routes
router.get('/google', authController_1.googleAuth);
router.get('/google/callback', authController_1.googleCallback);
// Protected routes
router.get('/profile', auth_1.authenticate, authController_1.getProfile);
router.put('/profile', auth_1.authenticate, authController_1.updateProfile);
exports.default = router;
//# sourceMappingURL=auth.js.map