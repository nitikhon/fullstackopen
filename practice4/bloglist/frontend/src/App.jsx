import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [blogFormInfo, setBlogFromInfo] = useState({
    title: '',
    author: '',
    url: ''
  })
  const [notification, setNotification] = useState({
    message: '',
    type: ''
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }

    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    switch (name) {
      case 'username':
        setUsername(value)
        break
      case 'password':
        setPassword(value)
        break
      case 'title':
      case 'author':
      case 'url':
        setBlogFromInfo(prev => ({ ...prev, [name]: value }))
        break
      default:
        break
    }
  }

  const handleNotification = (message, type) => {
    setNotification({
      message,
      type
    })
    setTimeout(() => {
      setNotification({
        message: '',
        type: ''
      })
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
    } catch (error) {
      handleNotification(error.response.data.error, 'error')
    }
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()
    try {
      const blog = await blogService.createBlog(blogFormInfo)
      setBlogs(blogs.concat(blog))
      setBlogFromInfo({
        title: '',
        author: '',
        url: ''
      })
      handleNotification(`A new blog ${blogFormInfo.title} by ${blogFormInfo.author} is created!`, 'success')
    } catch (error) {
      handleNotification(error.response.error, 'error')
    }
  }

  return (
    <div>
      {
        notification.message !== ''
          ? <Notification text={notification.message} type={notification.type} />
          : ''
      }
      {user ? (
        <div>
          <h2>blogs</h2>
          <p>{`${user.name} logged in`}</p>
          <button onClick={() => {
            window.localStorage.clear()
            window.location.reload()
          }}>
            logout
          </button>
          <CreateBlogForm
            handleCreateBlog={handleCreateBlog}
            handleChange={handleChange}
            blogInfo={blogFormInfo}
          />
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      ) : (
        <LoginForm
          handleLogin={handleLogin}
          handleChange={handleChange}
          username={username}
          password={password}
        />
      )}
    </div>
  )
}

export default App