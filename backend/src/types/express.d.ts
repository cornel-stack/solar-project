declare namespace Express {
  interface User {
    id: string
    email: string
    name: string | null
    phone: string | null
    emailVerified: boolean
    provider: string | null
    createdAt: Date
    updatedAt: Date
    preferences: any
  }
}