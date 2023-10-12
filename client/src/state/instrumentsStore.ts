import { io } from 'socket.io-client'
import { create } from 'zustand'

import { wsUrl } from '../utils'
import { getAllInstruments } from '../utils/fetchFunctions'

export type Instrument = {
  id: number
  symbol: string
  logo: string
  current_price: number
  last_updated: string
}

type UpdatedInstrument = {
  id: number
  price: number
}

type InstrumentStore = {
  instruments: Instrument[]
  fetchInstruments: () => Promise<void>
  updateInstrument: (updatedInstrument: UpdatedInstrument) => void
}

export const useInstrumentsStore = create<InstrumentStore>()((set) => ({
  instruments: [],

  fetchInstruments: async () => {
    const data = await getAllInstruments()
    set({ instruments: data })
  },

  updateInstrument: (updatedInstrument: UpdatedInstrument) => {
    set((state) => ({
      instruments: state.instruments.map((instrument) =>
        instrument.id === updatedInstrument.id ? { ...instrument, current_price: updatedInstrument.price } : instrument
      ),
    }))
  },
}))

/** websockets */
// connection
const socket = io(wsUrl)

// connection
socket.on('connect', () => {
  console.log(`ws connected ${socket.id}`)
})

// price update msg
socket.on('priceUpdate', (updatedInstrument) => {
  useInstrumentsStore.getState().updateInstrument(updatedInstrument)
})
