require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const PORT = process.env.PORT || 3001
const Person = require('./models/person')

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(result => {
    res.json(result)
  }).catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  Person.find({}).then(result =>
    res.send(`
    <p>Phonebook has info for ${result.length} people.</p>
    <p>${new Date()}</p>
    `)
  ).catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).json({ error: `a person with id = ${req.params.id} is not found` })
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id).then(person => {
    if (person) {
      res.status(204).end()
    } else {
      res.status(404).json({ error: `a person with id = ${req.params.id} is not found` })
    }
  }).catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'name and number are required' })
  }

  Person.findOne({ name: { $regex: name, $options: 'i' } }).then(existedPerson => {
    if (existedPerson) {
      return res.status(400).json({ error: 'name must be unique' })
    }

    const person = new Person({
      name,
      number
    })

    person.save()
      .then(result => res.json(result))
      .catch(error => next(error))
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true }
  ).then(updatedPerson => {
    if (updatedPerson) {
      res.json(updatedPerson)
    } else {
      res.status(404).json({ error: 'person not found' })
    }
  }).catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })

  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})