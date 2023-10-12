import { useEffect, useState } from 'react'
import { FaRegStar, FaStar } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

import { User } from '../../state/userStore'
import { addOrRemoveUserFavorite } from '../../utils/fetchFunctions'

interface StarCheckboxProps {
  user: User
  instrumentId: number
  setUser: (user: User) => void
  disabled: boolean
}

export default function StarCheckbox({ user, instrumentId, setUser, disabled }: StarCheckboxProps) {
  const navigate = useNavigate()

  const [favorited, setFavorited] = useState(false)

  /** check if the instrument is favorited */
  useEffect(() => {
    const instrumentFavorited = user?.favorites.find((favorite) => favorite.id === instrumentId)
    setFavorited(instrumentFavorited ? true : false)
  }, [instrumentId, user?.favorites])

  /** add/remove favorites or navigate to login */
  const handleStarClick = async () => {
    if (user) {
      const addOrRemoveFavoriteRes = await addOrRemoveUserFavorite(user.id, instrumentId, !favorited ? 'add' : 'remove')
      console.log({ addOrRemoveFavoriteRes })

      const newUser = { ...user, favorites: addOrRemoveFavoriteRes }
      setUser(newUser) // update user
    } else {
      navigate('/login') // navigate to login
    }
  }

  return (
    <span onClick={disabled ? undefined : handleStarClick} style={{ cursor: disabled ? 'default' : 'pointer' }}>
      {favorited ? <FaStar /> : <FaRegStar />}
    </span>
  )
}
