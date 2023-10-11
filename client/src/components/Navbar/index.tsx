import './index.css'

import { Link } from 'react-router-dom'

import viteLogo from '/vite.svg'

import { User } from '../../userStore'

interface NavbarProps {
  user: User
  clearUser: () => void
}

export default function Navbar({ user, clearUser }: NavbarProps) {
  return (
    <div className="container">
      <div className="innerContainer">
        <div className="homeContainer">
          <Link to="/">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </Link>
          <Link to="/">
            <p>Home</p>
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
