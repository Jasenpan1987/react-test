// using helpful utilities
import React from 'react'
import {generate} from 'til-client-test-utils'
import {render, Simulate} from 'react-testing-library'
// note that til-client-test-utils is found in `client/test/til-client-test-utils`
import Login from '../login'

test('calls onSubmit with the username and password when submitted', () => {
  const fakeUser = generate.loginForm()
  const handleSubmit = jest.fn()
  const {container, getByLabelText, getByText} = render(
    <Login onSubmit={handleSubmit} />,
  )

  const usernameNode = getByLabelText('Username')
  const passwordNode = getByLabelText('Password')

  const formNode = container.querySelector('form')
  const submitButtonNode = getByText('Submit')

  usernameNode.value = fakeUser.username
  passwordNode.value = fakeUser.password

  Simulate.submit(formNode)

  expect(handleSubmit).toHaveBeenCalledTimes(1)
  expect(handleSubmit).toHaveBeenCalledWith(fakeUser)
  expect(submitButtonNode.type).toBe('submit')
})

test.skip('I submitted my elaboration and feedback', () => {
  const submitted = true // change this when you've submitted!
  expect(submitted).toBe(true)
})
////////////////////////////////
