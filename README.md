# arche-react-nodejs-website
Quickstart project for a dynamic website using Arche, React, and Node.js.

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

## serve
`serve` is the entrypoint for the Node.js application. `serve` spins up the main webserver and the HTML server. The HTML server spins up a number of workers equal to the number of CPUs on the machine.

Options:
  * `port` - the port that the main Node.js server will listen on.
  * `htmlServerPort` - the port that the Node.js HTML server will listen on.
  * `htmlServerNoCache` - whether to bypass the import cache in the HTML server. Should be false for production.

## fetch2
Sometimes the request errors out between the main server and the HTML server. `fetch2` handles these errors with retries.

## Adding Routes
Currently to add a new route you have to add both a server route in `ServePage.js` and a client route in `public/react/Router.js`.
