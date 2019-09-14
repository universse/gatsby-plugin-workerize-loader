const { resolve } = require('path')

const { prefix } = require('./constants')

exports.onCreateWebpackConfig = ({
  actions: { replaceWebpackConfig },
  getConfig,
  stage
}) => {
  const config = getConfig()

  let options = {}

  if (stage === 'build-javascript') {
    config.optimization.moduleIds = 'total-size'
    options = { name: `${prefix}-[1].[hash:6]`, regExp: '(\\w+).worker.js' }
  }

  config.module.rules.push({
    test: /\.worker\.js$/,
    use: { loader: 'workerize-loader', options }
  })

  config.output.globalObject = 'this'

  replaceWebpackConfig(config)
}
