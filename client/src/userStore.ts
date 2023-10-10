import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type User = {
  id: number
  email: string
} | null

type UserStore = {
  user: User
  setUser: (user: User) => void
  clearUser: () => void
}

// export const useUserStore0 = create<UserStore>()((set) => ({
//   user: null,
//   setUser: (user: User) => set({ user }),
//   clearUser: () => set({ user: null }),
// }))

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
