import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import socket from '../ws'
import { Instrument } from './instrumentsStore'

export type User = {
  id: number
  email: string
  phone_number: string | null
  favorites: Instrument[]
  priceAlerts: PriceAlert[]
} | null

export type AlertType = 'ABOVE' | 'BELOW'
export type PriceAlert = {
  id: number
  user_id: number
  instrument_id: number
  target_price: string
  alert_type: AlertType
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

// alert has been sent and deleted
socket.on('alertsUpdate', (alerts) => {
  console.log('ws alertsUpdate', { alerts })

  const user = useUserStore.getState().user
  if (user) {
    useUserStore.getState().setUser({ ...user, priceAlerts: alerts })
  }
})
