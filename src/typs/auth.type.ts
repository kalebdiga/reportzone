export type User = {
  id: string
  name: string
  email: string
  role: 'user' | 'admin' // or other roles if applicable
  photo: string
  age: number
  passwordCangedAt: string // ISO date string
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
  token: string
}
export type AuthResponse = {
  token: string
  data: {
    user: {
      _id: string
      name: string
      email: string
      role: 'user' | 'admin' // add other roles if necessary
      photo: string
      age: number
      passwordCangedAt: string // ISO date string
      createdAt: string // ISO date string
      updatedAt: string // ISO date string
      __v: number
    }
  }
}
