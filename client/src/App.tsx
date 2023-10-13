import './App.css'

import { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import InstrumentList from './components/InstrumentList'
import Navbar from './components/Navbar'
import PriceAlerts from './components/PriceAlerts'
import UserLogin from './components/UserLogin'
import { useInstrumentsStore } from './state/instrumentsStore'
import { useUserStore } from './state/userStore'

function App() {
  // state management for user
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)
  const clearUser = useUserStore((state) => state.clearUser)
  // instruments state
  const instruments = useInstrumentsStore((state) => state.instruments)
  const fetchInstruments = useInstrumentsStore((state) => state.fetchInstruments)

  // initial instruments fetch
  useEffect(() => {
    fetchInstruments()
  }, [fetchInstruments])

  useEffect(() => {
    console.log({ user })
  }, [user])

  return (
    <Router>
      <Navbar user={user} clearUser={clearUser} />
      <Routes>
        <Route path="/" element={<InstrumentList user={user} setUser={setUser} instruments={instruments} />} />
        <Route path="/login" element={<UserLogin setUser={setUser} />} />
        <Route path="/signup" element={<UserLogin setUser={setUser} />} />
        <Route path="/priceAlerts" element={<PriceAlerts user={user} setUser={setUser} instruments={instruments} />} />
      </Routes>
    </Router>
  )
}

export default App
