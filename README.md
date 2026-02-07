# arche-react-nodejs-website
Quickstart project for a dynamic website using Arche, React, and Node.js.

## Project Structure

```
arche-react-nodejs-website/
    public/
        react/
            Root.js
            Router.js
            Home.js
            NotFound.js
        global.js
        index.css
        index.html
    serve
    serve-dev
    StaticCache.js
    ServePage.js
    fetch2.js
    PageHtml.js
```

### [public/react/](/public/react)
Home of the client React application, with the application root at `Root.js`.

### [serve](/serve)
`serve` is the entrypoint for the Node.js application. `serve` spins up the main webserver and the HTML server. The HTML server spins up a number of workers equal to the number of CPUs on the machine.

`serve` options:
  * `port` - the port that the main Node.js server will listen on.
  * `htmlServerPort` - the port that the Node.js HTML server will listen on.
  * `htmlServerNoCache` - whether to bypass the import cache in the HTML server. Should be true for development.

### [serve-dev](/serve-dev)
Script that runs the server for development.

### [StaticCache.js](/StaticCache.js)
An in-memory cache of static files.

`StaticCache` options:
  * `directory` - the directory of static files to serve.

### [ServePage.js](/ServePage.js)
The HTTP handler for serving static files and HTML pages.

### [fetch2](/fetch2.js)
Sometimes the request errors out between the main server and the HTML server. `fetch2` handles these errors with retries.

### [PageHTML.js](/PageHTML.js)
Returns the HTML for all pages.

`PageHTML` options:
  * `url` - the canonical `url` of the page.
  * `reactRootHTML` - the page-specific HTML received from the HTML server. Includes the `<div id="react-root">...</div>` tag and all children.

## Installation
Install dependencies.
```sh
npm i
```

Install dependencies for the HTML server.
```sh
cd html-server
npm i
```

## Run the development server
```sh
./serve-dev
```

## Run the production server
```sh
NODE_ENV=production PORT=8080 HTML_SERVER_PORT=8081 ./serve
```

## Adding Routes
Currently to add a new route you have to add both a server route in `ServePage.js` and a client route in `public/react/Router.js`.
