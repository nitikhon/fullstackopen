import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/Form'
import Persons from './components/Persons'
import axios from 'axios'
import personsService from './services/persons'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [notification, setNotification] = useState({
    message: '',
    type: ''
  })

  useEffect(() => {
    personsService
      .getPersons()
      .then((response) => {
        const data = response.data
        setPersons(data)
      })
  }, [])
  console.log(persons)

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filterValue.toLowerCase()))

  const handleSubmit = (event) => {
    event.preventDefault()
    const filterName = persons.filter(person => person.name.toLowerCase() === newName.toLowerCase())
    const newPerson = {
      name: newName,
      number: newPhone,
      id: filterName[0]?.id
    }

    if (filterName.length > 0) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personsService
          .updatePerson(newPerson)
          .then(updatedPerson => {
            const newPersons = persons.map(person => person.id === updatedPerson.id ? updatedPerson : person)
            setPersons(newPersons)
            handleNotification(`Added ${updatedPerson.name}`, 'success')
          })
        return
      } else {
        return
      }
    }

    personsService
      .addPerson(newPerson)
      .then(person => {
        setPersons(persons.concat(person))
        handleNotification(`Added ${person.name}`, 'success')
      })
  }

  const handleChange = (event) => {
    switch (event.target.id) {
      case "name":
        setNewName(event.target.value)
        break;
      case "phone":
        setNewPhone(event.target.value)
        break;
      case "filter":
        setFilterValue(event.target.value)
        break;
      default:
        break;
    }
  }

  const handleDelete = (name, id) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personsService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(() => {
          handleNotification(
            `Information of ${name} has already been removed from server`,
            'error'
          )
        })
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

  return (
    <div>
      <h2>Phonebook</h2>
      {
        notification.message !== ''
          ? <Notification text={notification.message} type={notification.type} />
          : <div></div>
      }
      <Filter onChange={handleChange} />

      <h2>Add value</h2>
      <PersonForm onSubmit={handleSubmit} onChange={handleChange} />

      <h2>Numbers</h2>
      {
        filterValue === ""
          ? <Persons persons={persons} handleDelete={handleDelete} />
          : <Persons persons={filteredPersons} handleDelete={handleDelete} />
      }
    </div>
  )
}

export default App