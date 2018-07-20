import React from 'react'
import ReactDOM from 'react-dom'
import ItemList from '../item-list'

test('Should render empty list when no items', () => {
  const container = document.createElement('div')
  ReactDOM.render(<ItemList items={[]} />, container)
  expect(container.textContent).toMatch('no items')
})

test('should render list with 3 items', () => {
  const container = document.createElement('div')
  const items = ['apple', 'orange', 'pear']
  const emptyList = <ItemList items={items} />
  ReactDOM.render(emptyList, container)
  expect(container.textContent).toMatch('apple')
  expect(container.textContent).toMatch('pear')
  expect(container.textContent).toMatch('orange')
})

test.skip('I submitted my elaboration and feedback', () => {
  const submitted = true
  expect(submitted).toBe(true)
})
////////////////////////////////
