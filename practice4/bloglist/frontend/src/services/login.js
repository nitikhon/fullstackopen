import axios from 'axios'
const baseUrl = '/api/login'

const login = async (payload) => {
  const res = await axios.post(baseUrl, payload)
  return res.data
}

export default { login }