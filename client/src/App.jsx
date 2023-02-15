import { useState, useEffect, useRef } from 'react'
import './App.css'

const createCookie = async () => {
  const request = await fetch('http://localhost:5000/auth/createUser', {
      method: 'POST',
      credentials: "include"
    })
    const response = await request.json()
    
    console.log(response)
}

function App() {
  const [count, setCount] = useState({})
  const cookieCreated = useRef(false)

  useEffect(() => {
    if(cookieCreated.current) return;
    cookieCreated.current = true

    const createCookie = async () => {
      const request = await fetch('http://localhost:5000/auth/createUser', {
          method: 'POST',
          credentials: "include"
        })
        const response = await request.json()
        
        setCount(prevState => prevState = response)
    }

    createCookie()
  }, [])

  return (
    <>
      <p>Hostname: <strong>{count.hostname}</strong></p>
      <p>UUID: <strong>{count.uuid}</strong></p>
    </>
  )
}

export default App
