// module.exports = {
//   presets: [['env', {modules: false}], 'react'],
//   plugins: [
//     'syntax-dynamic-import',
//     'transform-class-properties',
//     'transform-object-rest-spread',
//   ],
// }

/*
Solution snippets below
*/

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

/*
const isTest = String(process.env.NODE_ENV) === 'test'


for the env plugin modules config:
isTest ? 'commonjs' : false

For dynamic import config in plugins
isTest ? 'dynamic-import-node' : null
 */
