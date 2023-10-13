import './index.css'

import { useEffect, useState } from 'react'
import { FaRegPlusSquare } from 'react-icons/fa'
import { LuTrash } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'

import { InstrumentWithPrevious } from '../../state/instrumentsStore'
import { User } from '../../state/userStore'
import { formatNumber } from '../../utils'
import { deletePriceAlert } from '../../utils/fetchFunctions'
import Popup from './Popup'

interface PriceAlertsProps {
  user: User
  setUser: (user: User) => void
  instruments: InstrumentWithPrevious[]
}

export default function PriceAlerts({ user, setUser, instruments }: PriceAlertsProps) {
  const navigate = useNavigate()

  const [popupOpen, setPopupOpen] = useState(false)

  useEffect(() => {
    console.log({ priceAlerts: user?.priceAlerts })
  }, [user?.priceAlerts])

  /** add a confirmation popup */
  const handleDeletePriceAlert = async (priceAlertId: number) => {
    if (user) {
      const deleteAlertRes = await deletePriceAlert(user.id, priceAlertId)
      console.log({ deleteAlertRes })

      const newUser: User = { ...user, priceAlerts: deleteAlertRes }
      setUser(newUser)
    }
  }

  return (
    <>
      <Popup
        user={user}
        setUser={setUser}
        instruments={instruments}
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
      />
      <table className="alertsTable">
        <thead>
          <tr>
            <th>
              {user !== null && (
                <span
                  style={{ height: '20px', display: 'block', cursor: 'pointer' }}
                  onClick={() => setPopupOpen(true)}
                >
                  <FaRegPlusSquare />
                </span>
              )}
            </th>
            <th>Coin</th>
            <th>Alert Price</th>
          </tr>
        </thead>
        <tbody>
          {user?.priceAlerts && user.priceAlerts.length > 0 ? (
            <>
              {user.priceAlerts.map((priceAlert, idx) => (
                <tr key={idx}>
                  <td>
                    <span onClick={() => handleDeletePriceAlert(priceAlert.id)} style={{ cursor: 'pointer' }}>
                      <LuTrash strokeWidth={2.5} />
                    </span>
                  </td>
                  <td>
                    <div className="instrumentName">
                      <img
                        src={priceAlert.instrument.logo}
                        alt={priceAlert.instrument.symbol}
                        className="instrumentIcon"
                      />
                      <p>{priceAlert.instrument.symbol}</p>
                    </div>
                  </td>
                  <td>
                    <p className="priceCell">{formatNumber(parseFloat(priceAlert.target_price))}</p>
                  </td>
                </tr>
              ))}
            </>
          ) : (
            <tr>
              <td></td>
              <td style={{ fontWeight: '500' }}>{user ? 'Add a price alert!' : 'Login to access alerts'}</td>
              <td></td>
            </tr>
          )}
          <tr></tr>
        </tbody>
      </table>
    </>
  )
}
