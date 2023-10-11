import { apiUrl } from '.'

/** user methods */
/**
 * @param loginOrCreate true=login; false=create.. based on this param, we call either /user/{login || create}
 * @returns user {id, email}
 */
export const loginOrCreateUser = async (email: string, password: string, loginOrCreate: boolean) => {
  const url = `${apiUrl}user/${loginOrCreate ? 'login' : 'create'}`

  try {
    const res = await fetch(url, {
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

    // we check for exceptions which should be shown to the user, otherwise throw error
    const validExceptions = ['Invalid credentials', 'Email in use']
    if (!res.ok && !validExceptions.includes(data)) {
      throw new Error(`Server responded with status: ${res.status}`)
    }

    return data
  } catch (err) {
    console.log(err)
    throw new Error('Error occurred while making the request')
  }
}

/** instruments methods */
export const getAllInstruments = async () => {
  try {
    const res = await fetch(`${apiUrl}instrument/all`)
    if (!res.ok) {
      throw new Error(`Server responded with status: ${res.status}`)
    }

    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
    throw new Error('Error occurred while making the request')
  }
}

/** favorites methods */
export const getUserFavorites = async (userId: number) => {
  try {
    const res = await fetch(`${apiUrl}favorite/${userId}`)
    if (!res.ok) {
      throw new Error(`Server responded with status: ${res.status}`)
    }

    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
    throw new Error('Error occurred while making the request')
  }
}

/**
 * @param addOrRemove based on this param we either call /favorite/{add || remove}
 * @returns all user favorite instruments
 */
export const addOrRemoveUserFavorite = async (
  user_id: number,
  instrument_id: number,
  addOrRemove: 'add' | 'remove'
) => {
  const url = `${apiUrl}favorite/${addOrRemove}`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id,
        instrument_id,
      }),
    })
    if (!res.ok) {
      throw new Error(`Server responded with status: ${res.status}`)
    }

    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
    throw new Error('Error occurred while making the request')
  }
}
