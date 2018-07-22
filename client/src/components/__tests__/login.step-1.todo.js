import React from 'react'
import ReactDOM from 'react-dom'
import Login from '../login'

test('calls onSubmit with the username and password when submitted', () => {
  // Arrange
  // create a fake object to hold the form field values (username and password)
  const fakeUser = {
    username: 'foo',
    password: 'bar',
  }

  // create a jest.fn() for your submit handler
  const fakeOnSubmit = jest.fn()
  // render the Login component to a div
  // TIP: const div = document.createElement('div')
  const div = document.createElement('div')
  ReactDOM.render(<Login onSubmit={fakeOnSubmit} />, div)
  //
  // get the field nodes
  // TIP: const inputs = div.querySelectorAll('input')
  // TIP: const form = div.querySelector('form')
  // const inputs = div.querySelectorAll('input')
  const form = div.querySelector('form')
  const {username, password} = form.elements
  // fill in the field values
  username.value = fakeUser.username
  password.value = fakeUser.password
  //
  // Act
  // submit the form:
  // TIP: formNode.dispatchEvent(new window.Event('submit'))
  const submit = new window.Event('submit')
  form.dispatchEvent(submit)
  //
  // Assert
  // ensure your submit handler was called properly

  expect(fakeOnSubmit).toHaveBeenCalledTimes(1)
  expect(fakeOnSubmit).toBeCalledWith({
    username: fakeUser.username,
    password: fakeUser.password,
  })
})

//////// Elaboration & Feedback /////////
// When you've finished with the exercises:
// 1. Copy the URL below into your browser and fill out the form
// 2. remove the `.skip` from the test below
// 3. Change submitted from `false` to `true`
// 4. And you're all done!
/*
http://ws.kcd.im/?ws=Testing&e=login.step-1&em=
*/
test.skip('I submitted my elaboration and feedback', () => {
  const submitted = false // change this when you've submitted!
  expect(submitted).toBe(true)
})
////////////////////////////////
