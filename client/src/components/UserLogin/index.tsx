import './index.css'

import { ChangeEvent, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { User } from '../../state/userStore'
import { getUserFavorites, loginOrCreateUser } from '../../utils/fetchFunctions'

type LoginForm = {
  email: string
  password: string
}

interface UserLoginProps {
  setUser: (user: User) => void
}

export default function UserLogin({ setUser }: UserLoginProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  /** state vars */
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  })
  const [errorMessage, setErrorMessage] = useState('')

  /** form submission */
  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    // call the api
    const loginOrCreateRes = await loginOrCreateUser(formData.email, formData.password, pathname === '/login')

    // set error message or login
    if (['Invalid credentials', 'Email in use'].includes(loginOrCreateRes)) {
      setErrorMessage(loginOrCreateRes)
    } else if ('id' in loginOrCreateRes && 'email' in loginOrCreateRes) {
      /** @dev if they logged in, get the user favorites */
      const userFavorites = pathname === '/login' ? await getUserFavorites(loginOrCreateRes.id) : []
      const user = { ...loginOrCreateRes, favorites: userFavorites }
      setUser(user)
      navigate('/')
    }
    console.log({ loginOrCreateRes })

    setFormData({ email: '', password: '' }) // clear form data
  }

  /** inputs change form data */
  const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }

  /** clear error message when user starts typing */
  useEffect(() => {
    if (formData.email.length > 0 || formData.password.length > 0) {
      setErrorMessage('')
    }
  }, [formData])

  /** clear form data and message when path changes */
  useEffect(() => {
    setFormData({ email: '', password: '' })
    setErrorMessage('')
  }, [pathname])

  return (
    <>
      <h3>Welcome!</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="email"
          name="email"
          value={formData.email}
          placeholder="Email"
          onChange={onChange}
          required
        />
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          placeholder="Password"
          onChange={onChange}
          required
        />
        {errorMessage !== '' && <p className="errorMessage">Error: {errorMessage}</p>}
        {pathname === '/login' && (
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        )}
        <button type="submit">{pathname === '/login' ? 'Log in' : 'Sign up'}</button>
      </form>
    </>
  )
}
