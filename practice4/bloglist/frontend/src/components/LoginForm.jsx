import { useState } from 'react'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target

    switch (name) {
    case 'username':
      setUsername(value)
      break
    case 'password':
      setPassword(value)
      break
    default:
      break
    }
  }

  const login = (event) => {
    event.preventDefault()
    handleLogin({
      username,
      password
    })
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h1>login to an application</h1>
      <form onSubmit={login}>
        <div>
          <label htmlFor="username">username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm