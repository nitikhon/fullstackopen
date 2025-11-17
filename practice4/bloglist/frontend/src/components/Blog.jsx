import { useState } from 'react'

const Blog = ({ blog, handleLike, handleRemoveBlog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const likeBlog = () => {
    handleLike(blog.id)
  }

  const removeBlog = () => {
    handleRemoveBlog(blog.id, blog.title, blog.author)
  }

  return (

    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(prev => !prev)}>
          view
        </button>
      </div>
      <div style={showWhenVisible}>
        <div>
          {blog.title} {blog.author}
          <button onClick={() => setVisible(prev => !prev)}>
            hide
          </button>
        </div>
        <div>{blog.url}</div>
        <div>
          {blog.likes}
          <button onClick={likeBlog}>
            like
          </button>
        </div>
        <div>{blog.user?.name}</div>
        <button onClick={removeBlog}>remove</button>
      </div>
    </div>
  )
}
export default Blog