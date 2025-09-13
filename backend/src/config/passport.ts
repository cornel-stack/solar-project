import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import prisma from './database'
import { generateTokenPair } from '@/utils/jwt'

export const setupPassport = (): void => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `${process.env.FRONTEND_URL?.replace('3000', '8000') || 'http://localhost:8000'}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await prisma.user.findUnique({
            where: { email: profile.emails![0].value },
          })

          if (user) {
            // User exists - update with Google info if needed
            if (!user.provider || user.provider !== 'google') {
              user = await prisma.user.update({
                where: { id: user.id },
                data: {
                  provider: 'google',
                  googleId: profile.id,
                  name: user.name || profile.displayName,
                  emailVerified: true,
                  lastLogin: new Date(),
                },
              })
            } else {
              // Just update last login
              user = await prisma.user.update({
                where: { id: user.id },
                data: { lastLogin: new Date() },
              })
            }
          } else {
            // Create new user
            user = await prisma.user.create({
              data: {
                email: profile.emails![0].value,
                name: profile.displayName,
                provider: 'google',
                googleId: profile.id,
                emailVerified: true,
                lastLogin: new Date(),
              },
            })
          }

          return done(null, user)
        } catch (error) {
          return done(error, undefined)
        }
      }
    )
  )

  passport.serializeUser((user: any, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await prisma.user.findUnique({
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
      })
      done(null, user)
    } catch (error) {
      done(error, null)
    }
  })
}