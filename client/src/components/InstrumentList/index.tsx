import './index.css'

import { useEffect } from 'react'

import { useInstrumentsStore } from '../../state/instrumentsStore'
import { User } from '../../state/userStore'
import Tooltip from '../Tooltip'
import StarCheckbox from './StarCheckbox'

export type Instrument = {
  id: number
  symbol: string
  logo: string
  current_price: number
  last_updated: string
}

interface InstrumentListProps {
  user: User
  setUser: (user: User) => void
}

export default function InstrumentList({ user, setUser }: InstrumentListProps) {
  const instruments = useInstrumentsStore((state) => state.instruments)
  const fetchInstruments = useInstrumentsStore((state) => state.fetchInstruments)

  useEffect(() => {
    fetchInstruments()
  }, [fetchInstruments])

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
        {instruments && instruments.length > 0 ? (
          <>
            {instruments.map((instrument, idx) => (
              <tr key={idx}>
                <td>
                  {!user ? (
                    <Tooltip text="Log in to favorite">
                      <StarCheckbox user={user} instrumentId={instrument.id} setUser={setUser} disabled={true} />
                    </Tooltip>
                  ) : (
                    <StarCheckbox user={user} instrumentId={instrument.id} setUser={setUser} disabled={false} />
                  )}
                </td>
                <td>
                  <div className="instrumentName">
                    <img src={instrument.logo} alt={instrument.symbol} className="instrumentIcon" />
                    <p>{instrument.symbol}</p>
                  </div>
                </td>
                <td>{instrument.current_price}</td>
              </tr>
            ))}
          </>
        ) : (
          <tr>
            <td>
              <input type="checkbox" disabled />
            </td>
            <td>
              <div className="instrumentName">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Circle_%28transparent%29.png/64px-Circle_%28transparent%29.png"
                  alt="blankLogo"
                  className="instrumentIcon"
                />
                <p>Loading...</p>
              </div>
            </td>
            <td>0.0</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
