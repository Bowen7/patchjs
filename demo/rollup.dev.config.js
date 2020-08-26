const rollup = require("rollup")
const serve = require("rollup-plugin-serve")
const livereload = require("rollup-plugin-livereload")
const { terser } = require("rollup-plugin-terser")
const html = require("@rollup/plugin-html")
const path = require("path")
// see below for details on the options
const inputOptions = {
  input: path.resolve(__dirname, "./app.js"),
}
const outputOptions = {
  dir: path.resolve(__dirname, "../dist"),
  format: "iife",
  plugins: [
    serve(path.resolve(__dirname, "../dist")),
    livereload(),
    html(),
    terser(),
  ],
}

async function build() {
  const watcher = rollup.watch({
    ...inputOptions,
    output: outputOptions,
  })
  watcher.on("event", event => {
    // event.code can be one of:
    //   START        — the watcher is (re)starting
    //   BUNDLE_START — building an individual bundle
    //   BUNDLE_END   — finished building a bundle
    //   END          — finished building all bundles
    //   ERROR        — encountered an error while bundling
    console.log(event)
  })
}

module.exports = build
