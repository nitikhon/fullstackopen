import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const getAll = async () => {
  const res = await axios.get(baseUrl)
  return res.data
}

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const createBlog = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const res = await axios.post(baseUrl, newObject, config)
  return res.data
}

const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: token }
  }
  const request = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return request.then(response => response.data)
}

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  const request = await axios.delete(`${baseUrl}/${id}`, config)
  return request.status
}

const likeBlog = async (id) => {
  const request = await axios.patch(`${baseUrl}/${id}/like`)
  return request.data
}

export default { getAll, createBlog, update, deleteBlog, likeBlog, setToken }