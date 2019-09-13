const React = require('react')
const { readdirSync } = require('fs')

const { prefix } = require('./constants')

const publicFolder = './public'

const isWorker = file => file.includes(prefix) && file.endsWith('.worker.js')
const shouldPreload = (file, preloads) =>
  file.startsWith(prefix) && preloads.some(preload => file.includes(preload))

  let preloadScripts = []

exports.onRenderBody = ({ setHeadComponents }, { preloads = [] } = {}) => {
  if (!preloads.length) return

  if (!preloadScripts.length) {
    preloadScripts = readdirSync(publicFolder)
      .filter(file => isWorker(file) && shouldPreload(file, preloads))
      .map(file => (
        <link
          key={file}
          as='javascript'
          crossOrigin='anonymous'
          href={`/${file}`}
          rel='preload'
        />
      ))
  }

  setHeadComponents(preloadScripts)
}
