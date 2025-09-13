"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupPassport = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const database_1 = __importDefault(require("./database"));
const setupPassport = () => {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await database_1.default.user.findUnique({
                where: { email: profile.emails[0].value },
            });
            if (user) {
                // User exists - update with Google info if needed
                if (!user.provider || user.provider !== 'google') {
                    user = await database_1.default.user.update({
                        where: { id: user.id },
                        data: {
                            provider: 'google',
                            googleId: profile.id,
                            name: user.name || profile.displayName,
                            emailVerified: true,
                            lastLogin: new Date(),
                        },
                    });
                }
                else {
                    // Just update last login
                    user = await database_1.default.user.update({
                        where: { id: user.id },
                        data: { lastLogin: new Date() },
                    });
                }
            }
            else {
                // Create new user
                user = await database_1.default.user.create({
                    data: {
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        provider: 'google',
                        googleId: profile.id,
                        emailVerified: true,
                        lastLogin: new Date(),
                    },
                });
            }
            return done(null, user);
        }
        catch (error) {
            return done(error, undefined);
        }
    }));
    passport_1.default.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport_1.default.deserializeUser(async (id, done) => {
        try {
            const user = await database_1.default.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    emailVerified: true,
                    provider: true,
                    createdAt: true,
                    updatedAt: true,
                    preferences: true,
                },
            });
            done(null, user);
        }
        catch (error) {
            done(error, null);
        }
    });
};
exports.setupPassport = setupPassport;
//# sourceMappingURL=passport.js.map