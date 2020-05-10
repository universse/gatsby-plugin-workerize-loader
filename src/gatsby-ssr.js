const React = require('react')
const { readdirSync } = require('fs')

const { PREFIX } = require('./constants')

const publicFolder = './public'

const isWorker = file => file.includes(PREFIX) && file.endsWith('.worker.js')
const shouldPreload = (file, preloads) =>
  file.startsWith(PREFIX) && preloads.some(preload => file.includes(preload))

let preloadScripts = []

// For some reason, this does not work as expected on Chrome.
// So for now, I'm not mentioning preloads option in README.
exports.onRenderBody = ({ setHeadComponents }, { preloads = [] } = {}) => {
  if (!preloads.length) return

  if (!preloadScripts.length) {
    preloadScripts = readdirSync(publicFolder)
      .filter(file => isWorker(file) && shouldPreload(file, preloads))
      .map(file => (
        <link
          key={file}
          as='worker'
          crossOrigin='anonymous'
          href={`/${file}`}
          rel='preload'
        />
      ))
  }

  setHeadComponents(preloadScripts)
}
