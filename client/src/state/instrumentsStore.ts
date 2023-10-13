import { io } from 'socket.io-client'
import { create } from 'zustand'

import { wsUrl } from '../utils'
import { getAllInstruments } from '../utils/fetchFunctions'

export type Instrument = {
  id: number
  symbol: string
  logo: string
  current_price: string
  last_updated: string
}

export type PriceDirection = 'up' | 'down' | 'same'

export type InstrumentWithPrevious = {
  lastPrice?: string
  priceDirection?: PriceDirection
} & Instrument

type UpdatedInstrument = {
  id: number
  price: string
}

type InstrumentStore = {
  instruments: InstrumentWithPrevious[]
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
      instruments: state.instruments.map((instrument) => {
        if (instrument.id === updatedInstrument.id) {
          const currentPrice = parseFloat(instrument.current_price)
          const updatedPrice = parseFloat(updatedInstrument.price)

          const direction: PriceDirection =
            currentPrice < updatedPrice ? 'up' : currentPrice > updatedPrice ? 'down' : 'same'

          return {
            ...instrument,
            current_price: updatedPrice.toString(),
            lastPrice: currentPrice.toString(),
            priceDirection: direction,
          }
        }
        return instrument
      }),
    }))
  },
}))

/** websockets */
// connection
const socket = io(wsUrl)

// connection
socket.on('connect', () => {
  console.log(`ws connected`)
})

// price update msg
socket.on('priceUpdate', (updatedInstrument) => {
  useInstrumentsStore.getState().updateInstrument(updatedInstrument)
})
