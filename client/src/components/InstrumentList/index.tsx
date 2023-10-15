import './index.css'

import { useState } from 'react'
import { FaRegBell } from 'react-icons/fa'

import { InstrumentWithPrevious, PriceDirection } from '../../state/instrumentsStore'
import { User } from '../../state/userStore'
import { formatNumber } from '../../utils'
import Popup from '../PriceAlerts/Popup'
import Tooltip from '../Tooltip'
import StarCheckbox from './StarCheckbox'

const getColor = (direction: PriceDirection | undefined) => {
  switch (direction) {
    case 'up':
      return '#00A83E'
    case 'down':
      return '#FF3A33'
    default:
      return 'inherit'
  }
}

interface InstrumentListProps {
  user: User
  setUser: (user: User) => void
  instruments: InstrumentWithPrevious[]
}

export default function InstrumentList({ user, setUser, instruments }: InstrumentListProps) {
  const [popupOpen, setPopupOpen] = useState(false)
  const [chosenInstrument, setChosenInstrument] = useState<InstrumentWithPrevious>()

  const handlePopupClose = () => {
    setPopupOpen(false)
    setChosenInstrument(undefined)
  }

  const handleAddAlertClick = (instrument: InstrumentWithPrevious) => {
    setChosenInstrument(instrument)
    setPopupOpen(true)
  }

  return (
    <>
      <Popup
        user={user}
        setUser={setUser}
        instruments={instruments}
        open={popupOpen}
        onClose={handlePopupClose}
        chosenInstrument={chosenInstrument}
      />
      <table className="instrumentsTable">
        <thead>
          <tr>
            <th></th>
            <th>Coin</th>
            <th>
              Price <small>(USD)</small>
            </th>
          </tr>
        </thead>
        <tbody>
          {instruments && instruments.length > 0 ? (
            <>
              {instruments.map((instrument, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      {!user ? (
                        <Tooltip text="Log in to favorite">
                          <StarCheckbox user={user} instrumentId={instrument.id} setUser={setUser} disabled={true} />
                        </Tooltip>
                      ) : (
                        <StarCheckbox user={user} instrumentId={instrument.id} setUser={setUser} disabled={false} />
                      )}
                      <span style={{ cursor: 'pointer', height: '22px' }}>
                        <FaRegBell onClick={() => handleAddAlertClick(instrument)} />
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="instrumentName">
                      <img src={instrument.logo} alt={instrument.symbol} className="instrumentIcon" />
                      <p>{instrument.symbol}</p>
                    </div>
                  </td>
                  <td style={{ color: getColor(instrument.priceDirection) }}>
                    <p className="priceCell">{formatNumber(parseFloat(instrument.current_price))}</p>
                  </td>
                </tr>
              ))}
            </>
          ) : (
            <tr>
              <td>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <StarCheckbox user={user} instrumentId={0} setUser={setUser} disabled={true} />
                  <FaRegBell />
                </div>
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
    </>
  )
}
