import { render, screen } from '@testing-library/react'
import CreateBlogFrom from '../components/CreateBlogForm'
import userEvent from '@testing-library/user-event'
import { test } from 'vitest'

test('the form calls the event handler with the right details when a new blog is created', async () => {
  const blog = {
    title: 'Internship experience at Google',
    author: 'C. Nitikhon',
    url: 'google.com',
  }
  const createBlogHandler = vi.fn()
  const user = userEvent.setup()

  const { container } = render(<CreateBlogFrom handleCreateBlog={createBlogHandler} />)

  const titleElement = container.querySelector('#title')
  const authorElement = container.querySelector('#author')
  const urlElement = container.querySelector('#url')
  const submitBtnElement = screen.getByText('create')

  await user.type(titleElement, blog.title)
  await user.type(authorElement, blog.author)
  await user.type(urlElement, blog.url)
  await user.click(submitBtnElement)

  expect(createBlogHandler.mock.calls).toHaveLength(1)
  expect(createBlogHandler.mock.calls[0][0]).toStrictEqual({
    title: blog.title,
    author: blog.author,
    url: blog.url,
  })
})