import './index.css'

import { Link, useLocation } from 'react-router-dom'

import viteLogo from '/vite.svg'

import { User } from '../../state/userStore'

interface NavbarProps {
  user: User
  clearUser: () => void
}

export default function Navbar({ user, clearUser }: NavbarProps) {
  const { pathname } = useLocation()

  return (
    <div className="container">
      <div className="innerContainer">
        <div className="homeContainer">
          <Link to="/">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </Link>
          <Link to="/" style={{ marginLeft: '1rem' }}>
            <p style={{ color: pathname === '/' ? 'rgb(83, 121, 155)' : 'inherit' }}>Home</p>
          </Link>
          <Link to="/priceAlerts">
            <p style={{ color: pathname === '/priceAlerts' ? 'rgb(83, 121, 155)' : 'inherit' }}>Alerts</p>
          </Link>
        </div>
        <div className="loginContainer">
          {/* If user is logged in, show "Log out", otherwise show "Log in" and "Sign up" */}
          {user ? (
            <button onClick={clearUser}>Log out</button>
          ) : (
            <>
              <Link to="/login">
                <button>Log in</button>
              </Link>
              <Link to="/signup">
                <button>Sign up</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
