# Karma Plugin for Snapshot Testing with Mocha

## Usage Example

```sh
$ npm install karma karma-webpack karma-sourcemap-loader karma-snapshot karma-mocha \
              karma-mocha-snapshot mocha chai --save-dev
```

Karma configuration: 

```js
// karma.conf.js
const webpack = require("webpack");

module.exports = function (config) {
  config.set({
    browsers: ["ChromeHeadless"],
    frameworks: ["mocha", "snapshot", "mocha-snapshot"],
    reporters: ["mocha"],
    preprocessors: { "__tests__/index.js": ["webpack", "sourcemap"] },
    files: ["__tests__/index.js"],

    colors: true,
    autoWatch: true,

    webpack: {
      plugins: [
        new webpack.SourceMapDevToolPlugin({
          test: /\.js$/,
        }),
      ],
      performance: {
        hints: false
      },
    },

    webpackMiddleware: {
      stats: "errors-only",
      noInfo: true
    },

    snapshot: {
      update: !!process.env.UPDATE,
    },

    mochaReporter: {
      showDiff: true,
    },

    client: {
      mocha: {
        reporter: "html",
        ui: "bdd",
      }
    },
  });
};
```

Test file:

```js
// __tests__/index.js
import { use, expect } from "chai";
import { matchSnapshot } from "chai-snapshot";
use(matchSnapshot);

it("check snapshot", () => {
  expect("Hello World").to.matchSnapshot();
});
```

Run tests:

```sh
$ karma start
```

Update snapshots:

```sh
$ UPDATE=1 karma start --single-run
```
