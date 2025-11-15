const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'test blog 1',
    author: 'john doe',
    url: 'google.com',
    likes: 2,
  },
  {
    title: 'test blog 2',
    author: 'lee sin',
    url: 'amazon.com',
    likes: 21,
  },
  {
    title: 'test blog 3',
    author: 'satoshi nakamoto',
    url: 'bitcoin.com',
    likes: 67,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb, usersInDb
}