import './App.css'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import InstrumentList from './components/InstrumentList'
import Navbar from './components/Navbar'
import UserLogin from './components/UserLogin'
import { useUserStore } from './userStore'

function App() {
  // state management for user
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)
  const clearUser = useUserStore((state) => state.clearUser)

  return (
    <Router>
      <Navbar user={user} clearUser={clearUser} />
      <Routes>
        <Route path="/" element={<InstrumentList />} />
        <Route path="/login" element={<UserLogin setUser={setUser} />} />
        <Route path="/signup" element={<UserLogin setUser={setUser} />} />
      </Routes>
    </Router>
  )
}

export default App
