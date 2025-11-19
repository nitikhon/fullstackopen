import { render, screen } from '@testing-library/react'
import Blog from '../components/Blog'
import userEvent from '@testing-library/user-event'
import { test } from 'vitest'

test('renders content', () => {
  const blog = {
    title: 'Internship experience at Google',
    author: 'C. Nitikhon',
    url: 'google.com',
    likes: 1,
  }

  render(<Blog blog={blog} />)

  const titleElement = screen.getAllByText(blog.title, { exact: false })
  const authorElement = screen.getAllByText(blog.author, { exact: false })

  const urlElement = screen.getByText(blog.url)
  const likesElement = screen.getByText(blog.likes)

  expect(titleElement).toBeDefined()
  expect(authorElement).toBeDefined()
  expect(urlElement).toBeDefined()
  expect(likesElement).toBeDefined()

  expect(titleElement[0]).toBeVisible()
  expect(authorElement[0]).toBeVisible()

  expect(urlElement).not.toBeVisible()
  expect(likesElement).not.toBeVisible()
})

test('url and likes are visible when clicked at the view button content', async () => {
  const blog = {
    title: 'Internship experience at Google',
    author: 'C. Nitikhon',
    url: 'google.com',
    likes: 1,
  }
  const user = userEvent.setup()

  render(<Blog blog={blog} />)

  const urlElement = screen.getByText(blog.url)
  const likesElement = screen.getByText(blog.likes)
  const buttonElement = screen.getByText('view')

  await user.click(buttonElement)

  expect(urlElement).toBeDefined()
  expect(likesElement).toBeDefined()

  expect(urlElement).toBeVisible()
  expect(likesElement).toBeVisible()
})

test('if the like button is clicked twice, the event handler is called twice.', async () => {
  const blog = {
    title: 'Internship experience at Google',
    author: 'C. Nitikhon',
    url: 'google.com',
    likes: 1,
  }
  const likeHandler = vi.fn()
  const user = userEvent.setup()

  render(<Blog blog={blog} handleLike={likeHandler} />)

  const viewBtnElement = screen.getByText('view')
  const likeBtnElement = screen.getByText('like')

  await user.click(viewBtnElement)
  await user.click(likeBtnElement)
  await user.click(likeBtnElement)

  expect(likeHandler.mock.calls).toHaveLength(2)
})