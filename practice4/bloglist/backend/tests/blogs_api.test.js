const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially some blogs saved and a user created', () => {
  let token

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const bcrypt = require('bcrypt')
    const saltRounds = 10
    const passwordHash = await bcrypt.hash('plainPassword123', saltRounds)

    const user = new User({
      username: 'cookie123',
      passwordHash: passwordHash,
      name: 'cookie and milk'
    })
    await user.save()

    const blogsWithUsers = helper.initialBlogs.map((blog) => ({
      ...blog,
      user: user._id
    }))

    await Blog.insertMany(blogsWithUsers)

    const response = await api
      .post('/api/login')
      .send({ username: 'cookie123', password: 'hashedP@ssw0rd' })
    token = response.body.token
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('blogs are returned same amount as initialBlogs', async () => {
    const blogs = await api.get('/api/blogs')

    assert.strictEqual(blogs.body.length, helper.initialBlogs.length)
  })

  test('the unique identifier property of the blog posts is named id', async () => {
    const blogs = await helper.blogsInDb()

    assert.notStrictEqual(blogs[0].id, undefined)
    assert.strictEqual(blogs[0]._id, undefined)
  })

  describe('create a new blog post', () => {
    test('successfully creates a new blog post', async () => {
      const blog = {
        title: 'single data test',
        author: 'juan gonsalez',
        url: 'tacos.com',
        likes: 11,
      }
      const blogsBefore = await helper.blogsInDb()

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blog)
        .expect(201)

      const blogsAfter = await helper.blogsInDb()

      assert.strictEqual(blogsAfter.length, blogsBefore.length + 1)
    })

    describe('missing properties', () => {
      test('like: default should be 0', async () => {
        const newBlog = {
          title: 'single data test',
          author: 'juan gonsalez',
          url: 'tacos.com',
        }

        const response = await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(newBlog)

        const blogs = await helper.blogsInDb()
        const blog = blogs.find(blog => blog.id === response.body.id)

        assert.strictEqual(blog.likes, 0)
      })

      test('title: responds with the status code 400.', async () => {
        const newBlog = {
          author: 'juan gonsalez',
          url: 'tacos.com',
          likes: 1,
        }

        await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(newBlog)
          .expect(400)
      })

      test('url: responds with the status code 400.', async () => {
        const newBlog = {
          title: 'single data test',
          author: 'juan gonsalez',
          likes: 1
        }

        await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(newBlog)
          .expect(400)
      })
    })

    test('returns 401 if no token is provided', async () => {
      const blog = {
        title: 'single data test',
        author: 'juan gonsalez',
        url: 'tacos.com',
        likes: 11,
      }

      await api
        .post('/api/blogs')
        .send(blog)
        .expect(401)
    })
  })

  describe('delete a blog post', () => {
    test('successfully delete blog', async () => {
      const blogs = await helper.blogsInDb()
      const id = blogs[0].id
      await api
        .delete(`/api/blogs/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
    })

    test('returns 401 if not token is provided', async () => {
      const blogs = await helper.blogsInDb()
      const id = blogs[0].id
      await api
        .delete(`/api/blogs/${id}`)
        .expect(401)
    })
  })

  describe('update a blog post', () => {
    test('successfully update blog', async () => {
      const blogs = await helper.blogsInDb()
      const blog = blogs[0]
      blog.likes += 10
      const result = await api
        .put(`/api/blogs/${blog.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(blog)
        .expect(200)

      assert.strictEqual(result.body.likes, blog.likes)
    })

    test('returns 401 if no token is provided', async () => {
      const blogs = await helper.blogsInDb()
      const blog = blogs[0]
      blog.likes += 10
      await api
        .put(`/api/blogs/${blog.id}`)
        .send(blog)
        .expect(401)
    })
  })

  test('like some blog', async () => {
    const blogs = await helper.blogsInDb()
    const blog = blogs[0]
    const result = await api
      .patch(`/api/blogs/${blog.id}/like`)
      .expect(200)

    assert.strictEqual(result.body.likes, blog.likes + 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})