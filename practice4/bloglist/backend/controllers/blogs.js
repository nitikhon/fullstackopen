const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.status(200).json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (req, res, next) => {
  const { title, url } = req.body

  if (!title || !url) {
    return res.status(400).end()
  }

  try {
    const userId = req.user

    const user = await User.findById(userId)
    if (!user) { return res.status(400).json({ error: 'userId missing or not valid' }) }

    const blog = new Blog({ ...req.body, user: userId })
    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()

    const populatedResult = await result.populate('user', { username: 1, name: 1 })
    res.status(201).json(populatedResult)
  } catch (error) {
    next(error)
  }
})

blogRouter.put('/:id', middleware.userExtractor, async (req, res, next) => {
  try {
    const userId = req.user
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
      return res.status(400).json({ error: 'invalid blog id' })
    }

    if (blog.user.toString() !== userId) {
      return res.status(401).json({ error: 'only the owner can update this blog' })
    }

    const result = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', { username: 1, name: 1 })

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
})

blogRouter.delete('/:id', middleware.userExtractor, async (req, res, next) => {
  try {
    const userId = req.user

    const blog = await Blog.findById(req.params.id)
    if (!blog) {
      return res.status(400).json({ error: 'invalid blog id' })
    }

    if (blog.user.toString() !== userId) {
      return res.status(401).json({ error: 'only the owner can delete this blog' })
    }

    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogRouter.patch('/:id/like', async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    const result = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    ).populate('user', { username: 1, name: 1 })

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
})

module.exports = blogRouter