module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.module\\.css$': 'identity-obj-proxy',
    '\\.css$': require.resolve('./test/style-mock.js'),
  },
  setupTestFrameworkScriptFile: require.resolve(
    './test/setup-test-framework.js',
  ),
}
