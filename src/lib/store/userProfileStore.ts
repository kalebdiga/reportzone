import { CompanyUser, User } from '@/typs/user.type'
import { create } from 'zustand'

interface UserStore {
  user: User | null
  companyUsers: CompanyUser[]
  setUserData: (user: User) => void
  setCompanyUsers: (companyUsers: CompanyUser[]) => void
  resetUserStore: () => void
}

export const useUserStore = create<UserStore>(set => ({
  user: null,
  companyUsers: [],
  setUserData: user => set({ user }),
  setCompanyUsers: companyUsers => set({ companyUsers }),
  resetUserStore: () => set({ user: null, companyUsers: [] })
}))
