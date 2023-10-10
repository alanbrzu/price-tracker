import './index.css'

import { useEffect, useState } from 'react'

import { apiUrl } from '../../utils'

const getAllInstruments = async () => {
  try {
    const res = await fetch(`${apiUrl}instrument/all`)
    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

type Instrument = {
  id: number
  symbol: string
  current_price: number
  last_updated: string
}

export default function InstrumentList() {
  const [instruments, setInstruments] = useState<Instrument[]>()

  useEffect(() => {
    const fetchInstruments = async () => {
      const res = await getAllInstruments()
      setInstruments(res)
    }
    fetchInstruments()
  }, [])

  useEffect(() => {
    console.log({ instruments })
  }, [instruments])

  return (
    <table className="instrumentsTable">
      <thead>
        <tr>
          <th></th>
          <th>Coin</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {instruments ? (
          <>
            {instruments.map((instrument, idx) => (
              <tr key={idx}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>
                  <div className="instrumentName">
                    <img
                      src="https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400"
                      alt={instrument.symbol}
                      className="instrumentIcon"
                    />
                    <p>{instrument.symbol}</p>
                  </div>
                </td>
                <td>{instrument.current_price}</td>
              </tr>
            ))}
          </>
        ) : (
          <p>Loading...</p>
        )}
      </tbody>
    </table>
  )
}
