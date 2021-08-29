# gatsby-plugin-workerize-loader

A Gatsby plugin to integrate web workers into your GatsbyJS app
via [workerize-loader](https://github.com/developit/workerize-loader).

## Install

Latest 2.0.0 version is compatible with Gatsby 3 and Webpack 5.

With Yarn:

```bash
yarn add gatsby-plugin-workerize-loader -D
```

Or with npm:

```bash
npm install --save-dev gatsby-plugin-workerize-loader
```

For Gatsby 2, please use version 1.5.0.

```bash
yarn add gatsby-plugin-workerize-loader@1.5.0 -D
```

Or with npm:

```bash
npm install --save-dev gatsby-plugin-workerize-loader@1.5.0
```

## Usage

Add plugin to gatsby-config.js

```js
plugins: ['gatsby-plugin-workerize-loader']
```

Create a worker file with suffix `.worker.js` e.g. `search.worker.js`.

```js
// search.worker.js
export async function search(searchInput) {
  // expensive search procedure...

  return searchResults
}
```

Import and instantiate the web worker in your source file. One caveat is web worker only
works in browser environment.

```js
// searchWorker.js
import SearchWorker from 'path/to/search.worker.js'

const searchWorker = typeof window === 'object' && new SearchWorker()

export default searchWorker
```

Use it in your component

```js
// SearchComponent.js
import searchWorker from "path/to/seachWorker.js";

function SearchComponent() {
  useEffect(() => {
    searchWorker.search(searchInput).then(
      searchResults => // do something with search results
    );
  }, [searchInput]);
}
```

## Recipes

### Lazy initialization

Worker code is only downloaded and parsed when you **first** instantiate Worker i.e. `new Worker()`. Automatic code-splitting 🔥🔥🔥.

#### With [useRef](https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily) within a component.

```js
// SearchComponent.js
import SearchWorker from "path/to/search.worker.js";

function SearchComponent() {
  const searchWorkerRef = useRef(null);

  function getSearchWorker() {
    if (!searchWorkerRef.current) {
      searchWorkerRef.current = new SearchWorker();
    }
    return searchWorkerRef.current;
  }

  useEffect(() => {
    getSearchWorker().search(searchInput).then(
      searchResults => // do something with search results
    );
  }, [searchInput]);
}
```

#### Or anywhere in your app.

```js
// getSearchWorker.js
import SearchWorker from 'path/to/search.worker.js'

let searchWorker

export default function getSearchWorker() {
  if (!searchWorker) {
    searchWorker = new SearchWorker()
  }
  return searchWorker
}
```

```js
// anywhere.js
import getSearchWorker from "path/to/getSearchWorker.js";

function someOperation (searchInput) {
  getSearchWorker().search(searchInput).then(
    searchResults => // do something with search results
  );

  // remaining steps
}
```

## License

MIT
