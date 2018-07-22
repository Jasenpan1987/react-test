import React from 'react'
import ReactDOM from 'react-dom'
import Editor from '../editor.todo'
import * as utilsMock from '../../utils/api'

jest.mock('../../utils/api.js', () => {
  return {
    posts: {
      create: jest.fn(() => {
        return Promise.resolve()
      }),
    },
  }
})

const flushPromise = () => {
  return new Promise(resolve => {
    setTimeout(resolve, 0)
  })
}

test('calls onSubmit with the username and password when submitted', async () => {
  const container = document.createElement('div')
  const fakeUser = {id: 'foo bar'}
  const fakeHistory = {
    push: jest.fn(),
  }
  ReactDOM.render(<Editor user={fakeUser} history={fakeHistory} />, container)

  const form = container.querySelector('form')
  const {title, content, tags} = form.elements
  title.value = 'I like twix'
  content.value = 'A lot of things'
  tags.value = 'twix,   my,likes'

  const submit = new window.Event('submit')
  form.dispatchEvent(submit)

  await flushPromise()
  expect(fakeHistory.push).toHaveBeenCalledTimes(1)
  expect(fakeHistory.push).toHaveBeenCalledWith('/')

  expect(utilsMock.posts.create).toHaveBeenCalledTimes(1)
  expect(utilsMock.posts.create).toHaveBeenCalledWith({
    authorId: fakeUser.id,
    title: title.value,
    content: content.value,
    tags: ['twix', 'my', 'likes'],
    date: expect.any(String),
  })
})

// TODO later...
test('snapshot', () => {})
