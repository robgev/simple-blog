import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import viteLogo from '/vite.svg'
import '../App.css'
import reactLogo from '../assets/react.svg'
import { axiosClient } from '../utils/axios'
import { endpoints } from '../utils/endpoints'

function App() {
  const [count, setCount] = useState(0)

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["jser"],
    queryFn: () => axiosClient.post(endpoints.auth.login, {
      email: "robert1999.g@gmail.com",
      password: "sOmeH4sh"
    })
  });

  const { data, isLoading } = useQuery({
    queryKey: ["test"],
    enabled: !isLoadingUser,
    queryFn: () => axiosClient.get(endpoints.posts.list(0), {
      headers: {
        Authorization: `Bearer ${user?.data.access_token}`
      }
    })
  })

  if (isLoading) return <span>Loading...</span>

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p className="text-3xl font-bold underline">
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
        { JSON.stringify(data?.data) || "DATA" }
      </p>
    </>
  )
}

export default App
