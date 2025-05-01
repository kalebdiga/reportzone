export interface User {
  id: string
  fname: string
  lname: string
  email: string
  accountStatus: string
  emailVerified: boolean
  globalRole: boolean
  verifiedAt: string
  createdAt: string
  updatedAt: string
}

export interface CompanyUser {
  id: string
  companyId: string
  userId: string
  isActive: boolean
  role: string
  createdAt: string
  updatedAt: string
}
