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
    html-server/
        index.mjs
        getRootHtml.mjs
        logRootHtml.mjs
    run.sh
    StaticCache.js
    ServePage.js
    fetch2.js
    PageHtml.js
    package.json
```

### [public/](/public)
The public directory. All files in this directory are made public to the internet. This directory is the root of the public website.

### [public/react/](/public/react)
Home of the client React application, with the application root at `Root.js`.

### [public/global.js](/public/global.js)
JavaScript in this file is run at the top of all HTML `.html` files. Define global variables and functions in this file, e.g. `window.myVariable = 1`.

### [public/index.css](/public/index.css)
The default CSS file.

### [public/index.html](/public/index.html)
This page is served to requests for the home page `/`.

### [html-server/](/html-server)
The HTML server. `html-server` is a Node.js webserver using the ECMAScript module system that imports the client React application root `Root.js` to generate and serve HTML. Requests to the HTML server should include in the request body the same `global` field used by `PageHTML`.

### [run.sh](/run.sh)
`run.sh` is the entrypoint for the Node.js application. `run.sh` spins up the main webserver and the HTML server. The HTML server spins up a number of workers equal to the number of CPUs on the machine.

### [StaticCache.js](/StaticCache.js)
An in-memory cache of static files.

`StaticCache` options:
  * `directory` - the directory of static files to serve.

### [ServePage.js](/ServePage.js)
The HTTP handler for serving static files and HTML pages.

### [fetch2](/fetch2.js)
Sometimes the request errors out between the main server and the HTML server. `fetch2` handles these errors with retries.

### [PageHtml.js](/PageHtml.js)
Returns the HTML for all pages. Contains all client-side dependencies.

`PageHtml` options:
  * `url` - the canonical URL of the page.
  * `reactRootHTML` - the page-specific HTML received from the HTML server. Includes the `<div id="react-root">...</div>` tag and all children.
  * `global` - object of variables that will be available to the client as `window` properties`. For example a variable `MYVAR` declared in the `global` option will be present in the client as `window.MYVAR`.

### [package.json](/package.json)
The project configuration.

`package.json` fields:
  * `name` - the name of the project. Can only contain lowercase letters, numbers, and dashes (`-`).
  * `version` - the version of the project.
  * `dependencies` - external dependencies needed by the project.
  * `env` - the environment-specific environment variables that will be provided to `run.sh`.

`package.json` `env` structure:
```
{
  production: {
    VARIABLE_1: 'production-example',
    VARIABLE_2: 'production-example',
    ...
  },
  local: {
    VARIABLE_1: 'local-example',
    VARIABLE_2: 'local-example',
    ...
  },
  ...
}
```

`package.json` `env` variables:
  * `PORT` - the port that the main Node.js server will listen on.
  * `HTML_SERVER_PORT` - the port that the Node.js HTML server will listen on.
  * `BYPASS_PUBLIC_CACHE` - whether to bypass the public cache in main server. Should be true for the local environment.

## Run it locally

1. Fork the repo

![github-fork-button](https://rubico.land/assets/github-fork-button.jpg)

2. Clone your forked version

```
# ssh
git clone git@github.com:your-github-user/arche-static-website.git

# https
git clone https://github.com/your-github-user/arche-static-website.git
```

3. Install dependencies

```
npm i
```

4. Install dependencies for the HTML server
```sh
cd html-server
npm i
```

5. Start the local web server

```sh
NODE_ENV=local ./run.sh
```

## Run it in production
```sh
NODE_ENV=production ./run.sh
```

