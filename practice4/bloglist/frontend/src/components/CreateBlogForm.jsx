import { useState } from 'react'

const CreateBlogFrom = ({ handleCreateBlog }) => {
  const [blogFormInfo, setBlogFromInfo] = useState({
    title: '',
    author: '',
    url: ''
  })

  const handleChange = (event) => {
    const { name, value } = event.target

    switch (name) {
    case 'title':
    case 'author':
    case 'url':
      setBlogFromInfo(prev => ({ ...prev, [name]: value }))
      break
    default:
      break
    }
  }

  const createBlog = (event) => {
    event.preventDefault()
    handleCreateBlog(blogFormInfo)
    setBlogFromInfo({
      title: '',
      author: '',
      url: ''
    })
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={createBlog}>
        <div>
          <label htmlFor="title">title</label>
          <input
            id="title"
            name="title"
            value={blogFormInfo.title}
            type="text"
            onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="author">author</label>
          <input
            id="author"
            name="author"
            value={blogFormInfo.author}
            type="text"
            onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="url">url</label>
          <input
            id="url"
            name="url"
            value={blogFormInfo.url}
            type="text"
            onChange={handleChange} />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default CreateBlogFrom