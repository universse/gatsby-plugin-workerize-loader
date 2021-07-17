const { PREFIX } = require('./constants')

exports.onCreateWebpackConfig = ({
  actions: { replaceWebpackConfig },
  getConfig,
  stage,
}) => {
  const config = getConfig()

  let options = {}

  if (stage === 'build-javascript') {
    options = {
      name: `${PREFIX}-[1].[contenthash]`,
      regExp: '(\\w+).worker.(js|ts|coffee)$',
    }
  }

  config.module.rules.push({
    test: /\.worker\.(js|ts|coffee)$/,
    use: { loader: 'workerize-loader', options },
  })

  replaceWebpackConfig(config)
}
