import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const [notification, setNotification] = useState({
    message: '',
    type: ''
  })
  const createBlogFormRef = useRef()
  const loginFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }

    (async function () {
      const blogs = await blogService.getAll()
      const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    })()

  }, [])

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

  const handleLogin = async (userObject) => {
    try {
      const user = await loginService.login(userObject)
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
    } catch (error) {
      handleNotification(error.response.data.error, 'error')
    }
  }

  const handleCreateBlog = async (blogObject) => {
    try {
      const blog = await blogService.createBlog(blogObject)
      setBlogs(blogs.concat(blog))
      handleNotification(`A new blog ${blogObject?.title} by ${blogObject?.author} is created!`, 'success')
      createBlogFormRef.current.toggleVisibility()
    } catch (error) {
      handleNotification(error.response.data.error, 'error')
    }
  }

  const handleLike = async (id) => {
    try {
      const updatedBlog = await blogService.likeBlog(id)
      const newBlogs = blogs.map(blog => {
        return (
          blog.id === updatedBlog.id
            ? updatedBlog
            : blog
        )
      })
      const sortedBlogs = newBlogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    } catch (error) {
      handleNotification(error.response.data.error, 'error')
    }
  }

  const handleRemoveBlog = async (id, title, author) => {
    try {
      if (window.confirm(`Remove blog ${title} by ${author}`)) {
        await blogService.deleteBlog(id)
        const currentBlogs = blogs.filter(blog => blog.id !== id)
        setBlogs(currentBlogs)
      }
    } catch (error) {
      handleNotification(error.response.data.error, 'error')
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
          <Togglable buttonLabel={'create new blog'} ref={createBlogFormRef}>
            <CreateBlogForm
              handleCreateBlog={handleCreateBlog}
            />
          </Togglable>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} handleLike={handleLike} handleRemoveBlog={handleRemoveBlog} />
          )}
        </div>
      ) : (
        <LoginForm
          handleLogin={handleLogin}
          ref={loginFormRef}
        />
      )}
    </div>
  )
}

export default App