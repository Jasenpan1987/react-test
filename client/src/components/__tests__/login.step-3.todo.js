// dealing with react's simulated events
import React from 'react'
import {generate} from 'til-client-test-utils'
import {renderIntoDocument, cleanup, fireEvent} from 'react-testing-library'
import Login from '../login'

afterEach(cleanup)

test('calls onSubmit with the username and password when submitted', () => {
  // Arrange
  const fakeUser = generate.loginForm()
  const handleSubmit = jest.fn()
  const {container, getByLabelText, getByText, unmount} = renderIntoDocument(
    <Login onSubmit={handleSubmit} />,
  )

  const usernameNode = getByLabelText('username')
  const passwordNode = getByLabelText('password')
  // const formNode = container.querySelector('form')
  const submitButtonNode = getByText('submit')

  // Act
  usernameNode.value = fakeUser.username
  passwordNode.value = fakeUser.password
  // submitButtonNode.click()
  fireEvent.click(submitButtonNode)
  // Assert
  expect(handleSubmit).toHaveBeenCalledTimes(1)
  expect(handleSubmit).toHaveBeenCalledWith(fakeUser)
  expect(submitButtonNode.type).toBe('submit')
})
