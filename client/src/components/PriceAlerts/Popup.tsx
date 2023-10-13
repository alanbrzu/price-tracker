import './Popup.css'

import { ChangeEvent, useEffect, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'

import { InstrumentWithPrevious } from '../../state/instrumentsStore'
import { User } from '../../state/userStore'
import { addPriceAlert } from '../../utils/fetchFunctions'

type PriceAlertForm = {
  instrumentId: number
  targetPrice: string
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

export default function Popup({ user, setUser, instruments, open, onClose, chosenInstrument }: PopupProps) {
  const [formData, setFormData] = useState<PriceAlertForm>({
    instrumentId: 1,
    targetPrice: '',
    phoneNumber: '',
  })

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    if (!user || (!user.phone_number && !phoneNumberRegex.test(formData.phoneNumber))) {
      return
    }

    const addPriceAlertRes = await addPriceAlert(
      user.id,
      Number(chosenInstrument ? chosenInstrument.id : formData.instrumentId), // if there is a chosen instrument, send that
      Number(formData.targetPrice),
      formData.phoneNumber
    )

    const newUser: User =
      user.phone_number !== null
        ? { ...user, priceAlerts: addPriceAlertRes }
        : { ...user, phone_number: formData.phoneNumber, priceAlerts: addPriceAlertRes }
    setUser(newUser)

    setFormData({
      instrumentId: 1,
      targetPrice: '',
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

  useEffect(() => {
    console.log({ chosenInstrument })
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
