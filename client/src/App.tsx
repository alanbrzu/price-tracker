import './App.css'

import { ChangeEvent, useEffect, useState } from 'react'

import viteLogo from '/vite.svg'

import reactLogo from './assets/react.svg'
import { apiUrl } from './utils'

const getAllInstruments = async () => {
  try {
    const res = await fetch(`${apiUrl}getInstrumentsAll`)
    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

const createUser = async (email: string, password: string) => {
  try {
    const res = await fetch(`${apiUrl}user/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

type LoginForm = {
  email: string
  password: string
}

function App() {
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  })

  useEffect(() => {
    const fetchInstruments = async () => {
      const res = await getAllInstruments()
      console.log({ allInstruments: res })
    }
    fetchInstruments()
  }, [])

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    const { email, password } = formData
    const createRes = await createUser(email, password)
    console.log(createRes)

    setFormData({ email: '', password: '' })
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }

  useEffect(() => {
    console.log({ formData })
  }, [formData])

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="email"
          name="email"
          value={formData.email}
          placeholder="Enter email"
          onChange={onChange}
        />
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          placeholder="Enter password"
          onChange={onChange}
        />
        <button type="submit">Create User</button>
      </form>
    </>
  )
}

export default App
