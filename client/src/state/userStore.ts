import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { Instrument } from './instrumentsStore'

export type User = {
  id: number
  email: string
  phone_number: string | null
  favorites: Instrument[]
  priceAlerts: PriceAlerts[]
} | null

export type PriceAlerts = {
  id: number
  user_id: number
  instrument_id: number
  target_price: string
  created_at: string
  instrument: Instrument
}

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
