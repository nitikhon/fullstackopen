import axios from "axios";

const baseUrl = process.env.NODE_ENV === 'production' 
  ? '/api/persons'
  : 'http://localhost:3001/api/persons'

const addPerson = (newObject) => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const deletePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

const updatePerson = (newObject) => {
    const request = axios.put(`${baseUrl}/${newObject.id}`, newObject)
    return request.then(response => response.data)
}

const getPersons = () => {
    return axios.get(baseUrl)
}

export default { addPerson, deletePerson, updatePerson, getPersons }