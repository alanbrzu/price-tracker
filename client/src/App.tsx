import './App.css'

import { useEffect, useState } from 'react'

import viteLogo from '/vite.svg'

import reactLogo from './assets/react.svg'

const getServerHome = async () => {
  try {
    const res = await fetch('/api')
    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

// const getAllInstruments = async () => {
//   try {
//     const res = await fetch('/api/getInstrumentsAll')
//     const data = await res.json()
//     return data
//   } catch (err) {
//     console.log(err)
//   }
// }

// const createUser = async () => {
//   try {
//     const res = await fetch('/api/createUser', {
//       method: 'POST',
//       body: JSON.stringify({
//         email: '',
//         password: '',
//       }),
//     })
//     const data = await res.json()
//     return data
//   } catch (err) {
//     console.log(err)
//   }
// }

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const fetchHome = async () => {
      const res = await getServerHome()
      console.log({ res })
    }
    fetchHome()
  }, [])

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
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  )
}

export default App
