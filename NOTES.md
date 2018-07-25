# React Test

## 1. Set up Jest

### 1.1 Install the dependencies.

run `npm install --save-dev jest`
and add the test script in package.json as `"test": "jest"`

- Side Note 1: make webpack treeshaking, we need the following setup in your babelrc file

```js
module.exports = {
  presets: [['env', {modules: false}], 'react'],
  plugins: [
    ...
  ],
}
```

- Side Note 2: we can use javascript to define our babelrc by simply name the file as `.babelrc.js`, and then add

```json
"babel": {
  "presets": "./.babelrc.js"
}
```

to the `package.json` file if the babel version is less than 7.

### 1.2 Update the babrlrc

```js
const isTest = String(process.env.NODE_ENV) === 'test'

module.exports = {
  presets: [['env', {modules: isTest ? 'commonjs' : false}], 'react'],
  plugins: [
    ...
  ],
}
```

The reason for this change is because the test runs at the Nodejs enviornment, and it doesn't understand es6 modules, so we need to compile it into commonjs modules.

### 1.3 Write a test

Any javascript file that has `.spec.js` or `.test.js` and anyfiles that with in a folder named `__tests__` will be run by jest as a test file.

```js
import {getFormattedValue} from '../utils'

test('adds missing .0', () => {
  expect(getFormattedValue('1234.0')).toBe('1,234.0')
})
```

### 1.4 Configure jest

Although jest is running on Nodejs enviornment, it still has a DOM enviornment called JSDOM, if we only test on javascript file that doesn't have reference to the DOM, such as Nodejs projects, we can remove the JSDOM for saving some memory. We can do it like this:

```json
"jest": {
  "testEnviornment": "node"
},
```

The default `testEnviornment` is `jsdom`

We also can create the jest configuration inside a file called `jest.config.js` and by default, jest will automatically read the file and load the coresponding configurations.

### 1.5 Jest with css

If the module we want to test contains any css imports, jest will be failed by default, so we need to add the following to the configurations:

```js
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    // the key here is a regex
    '\\.css$': require.resolve('./test/style-mock.js'),
  },
}

// test/style-mock
module.exports = {}
```

Here if we try to console log the innerHTML of the rendered div, we can only see `<div></div>`, the class name is missing, that is because we use the empty object in `style-mock` to render our stuff, to make it have the correct class name, we need some addtional steps:

1.  `npm install --save-dev identity-obj-proxy` noted here, this only work with css modules.

2.  Add addtional match in `jest.config.js`:

```js
module.exports = {
  ...
  moduleNameMapper: {
    '\\.module\\.css$': 'identity-obj-proxy',
    '\\.css$': require.resolve('./test/style-mock.js'),
  },
}
```

### 1.6 Handle Dynamic import

In some cases, we need to deal with dynamic imported modules, such as this:

```jsx
const CalculatorDisplay = Loadable({
  loader: () => import('./calculator-display').then(mod => mod.default),
  loading: () => <div style={{height: 120}}>Loading display...</div>,
})
```

1.  `npm install babel-plugin-dynamic-import-node --save-dev`

2.  In the babelrc.js file, add the plugin, and the `filter` thing is a trick to make sure the `null` won't blow out babel.

```js
const isTest = String(process.env.NODE_ENV) === 'test'

module.exports = {
  presets: [['env', {modules: isTest ? 'commonjs' : false}], 'react'],
  plugins: [
    'syntax-dynamic-import',
    'transform-class-properties',
    'transform-object-rest-spread',
    isTest ? 'dynamic-import-node' : null,
  ].filter(Boolean),
}
```

### 1.7 Dealing with localStorage

JSDOM doesn't have things like localStorage and session Storage by itself, so if our code has anything related to these storage strategies, the test will break. In order to supper this, we need to do the following:

1.  In the `test` directory, which is where we set up the `style-mock`, add another file called `setup-test-framework` (the name actually doesn't matter), and add the following code

```js
if (!window.localStorage) {
  window.localStorage = {}
  Object.assign(window.localStorage, {
    removeItem: function removeItem(key) {
      delete this[key]
    }.bind(window.localStorage),
    setItem: function setItem(key, val) {
      this[key] = String(val)
    }.bind(window.localStorage),
    getItem: function getItem(key) {
      return this[key]
    }.bind(window.localStorage),
  })
}
```

this code add the "fake" local storage to our JSDOM, so we need to make the test framework to run this before run any tests.

2.  In our `jest.config.js` file, add the following configuration, and you are good to go.

```js
module.exports = {
...
  setupTestFrameworkScriptFile: require.resolve(
    './test/setup-test-framework.js',
  ),
}
```

## 2. Basic Tests

1.  create a container to render the component

```jsx
const div = document.createElement('div')
ReactDOM.render(<Login onSubmit={fakeOnSubmit} />, div)
```

2.  provide the required props by injecting them into the component

```jsx
const fakeUser = {
  username: 'foo',
  password: 'bar',
}
```

3.  create fake data or mock handlers

```jsx
const fakeOnSubmit = jest.fn()
```

4.  dispatch events with the parameters

```jsx
const form = div.querySelector('form')
const {username, password} = form.elements

username.value = fakeUser.username
password.value = fakeUser.password

const submit = new window.Event('submit')
form.dispatchEvent(submit)
```

5.  making assertions

```jsx
expect(fakeOnSubmit).toHaveBeenCalledTimes(1)
expect(fakeOnSubmit).toBeCalledWith({
  username: fakeUser.username,
  password: fakeUser.password,
})
```

This is the basic steps for testing a react component, and this is also what happened behind the scene for some framework and abstractions.

## 3. react-testing-library

Here we use the `react-testing-library` rather than `enzyme` for the following reasons:

1.  The `shallow render` doesn't work well when refactor the code (extract a part of the code into a separate component...)

2.  `enzyme` always returns back a `container/wrapper`, which not very easy to use.

3.  `react-testing-library` added methods like `getByText` and `getByTestId` are either more close to the ways that users using the app or make the test cases more resilient to refactors.

```jsx
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
```

for more infomation about `react-testing-library` check out [here](https://github.com/kentcdodds/react-testing-library).
