const { test, describe, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')


const api = supertest(app)

describe('testing create a user...', () => {
  test('successfully create a user', async () => {
    const user = {
      username: 'noodlesman',
      password: 'P@ssw0rd',
      name: 'noodles man'
    }
    const usersBefore = await helper.usersInDb()

    await api.post('/api/users').send(user).expect(201)

    const usersAfter = await helper.usersInDb()

    assert.strictEqual(usersAfter.length, usersBefore.length + 1)
  })

  describe('if payload is send with invalid format, return proper status code', () => {
    test('username length is less than 3', async () => {
      const user = {
        username: 'no',
        password: 'P@ssw0rd',
        name: 'noodles man'
      }

      await api.post('/api/users').send(user).expect(400)
    })

    test('password length is less than 3', async () => {
      const user = {
        username: 'noodlesman',
        password: 'P@',
        name: 'noodles man'
      }

      await api.post('/api/users').send(user).expect(400)
    })
  })

})

after(async () => {
  await mongoose.connection.close()
})