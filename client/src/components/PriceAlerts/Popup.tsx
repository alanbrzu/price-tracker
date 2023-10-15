import './Popup.css'

import { ChangeEvent, useEffect, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'

import { InstrumentWithPrevious } from '../../state/instrumentsStore'
import { AlertType, User } from '../../state/userStore'
import { addPriceAlert } from '../../utils/fetchFunctions'

type PriceAlertForm = {
  instrumentId: number
  targetPrice: string
  alertType: AlertType | ''
  phoneNumber: string
}

interface PopupProps {
  user: User
  setUser: (user: User) => void
  instruments: InstrumentWithPrevious[]
  open: boolean
  onClose: () => void
  chosenInstrument?: InstrumentWithPrevious
}

const phoneNumberRegex = /^\+\d{1,3}-\d{3}-\d{3}-\d{4}$/

/** @dev @todo need to make sure the instrument current price doesnt move awa */
export default function Popup({ user, setUser, instruments, open, onClose, chosenInstrument }: PopupProps) {
  const [formData, setFormData] = useState<PriceAlertForm>({
    instrumentId: 1,
    targetPrice: '',
    alertType: '',
    phoneNumber: '',
  })

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    if (!user || (!user.phone_number && !phoneNumberRegex.test(formData.phoneNumber))) {
      return
    }

    const instrumentCurrentPrice = instruments.find(
      (instrument) => instrument.id === formData.instrumentId
    )?.current_price

    const targetPrice = Number(formData.targetPrice)
    const alertType = Number(instrumentCurrentPrice) > targetPrice ? 'BELOW' : 'ABOVE'

    console.log({ targetPrice, instrumentCurrentPrice, alertType })

    const addPriceAlertRes = await addPriceAlert(
      user.id,
      Number(formData.instrumentId),
      targetPrice,
      alertType,
      formData.phoneNumber
    )

    const newUser: User =
      user.phone_number !== null
        ? { ...user, priceAlerts: addPriceAlertRes }
        : { ...user, phone_number: formData.phoneNumber, priceAlerts: addPriceAlertRes }
    setUser(newUser)

    // might not need to reset form data since everytime the popup opens it is reset
    setFormData({
      instrumentId: 1,
      targetPrice: '',
      alertType: '',
      phoneNumber: '',
    })
    onClose()
  }

  const onChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>): void => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }

  // if user logs out while the popup is open, close it
  useEffect(() => {
    if (!user) {
      onClose()
    }
  }, [onClose, user])

  // set `formData.instrumentId` to chosenInstrument.id if it exists
  useEffect(() => {
    console.log({ chosenInstrument })
    if (chosenInstrument) {
      setFormData((prevState) => ({ ...prevState, instrumentId: chosenInstrument.id }))
    }
  }, [chosenInstrument])

  return open ? (
    <div className="popupContainer">
      <span className="closeButton" onClick={onClose}>
        <AiOutlineClose size={18} />
      </span>
      <form onSubmit={handleSubmit}>
        {chosenInstrument ? (
          <span style={{ fontWeight: '500' }}>{chosenInstrument.symbol}</span>
        ) : (
          <label>
            <select value={formData.instrumentId} id="instrumentId" name="instrumentId" onChange={onChange}>
              {instruments.map((instrument) => (
                <option key={instrument.id} value={instrument.id}>
                  {instrument.symbol}
                </option>
              ))}
            </select>
          </label>
        )}
        <input
          type="number"
          step="0.00000001"
          min="0.00000001"
          max="99999999999.99999999"
          id="targetPrice"
          name="targetPrice"
          value={formData.targetPrice}
          placeholder="Target price"
          onChange={onChange}
          required
        />
        {!user?.phone_number && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              placeholder="Phone number"
              onChange={onChange}
              pattern="^\+\d{1,3}-\d{3}-\d{3}-\d{4}$"
              required
            />
            <p>
              Only need to provide once
              <br />
              Format: +1-222-123-4567
            </p>
          </div>
        )}
        <button type="submit" style={{ marginTop: '4px' }}>
          Set Alert
        </button>
      </form>
    </div>
  ) : null
}
