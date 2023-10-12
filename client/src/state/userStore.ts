import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { Instrument } from './instrumentsStore'

export type User = {
  id: number
  email: string
  favorites: Instrument[]
} | null

type UserStore = {
  user: User
  setUser: (user: User) => void
  clearUser: () => void
}

// user state with local storage
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
