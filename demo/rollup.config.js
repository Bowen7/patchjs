const rollup = require("rollup")
const { terser } = require("rollup-plugin-terser")
const path = require("path")
// see below for details on the options
const inputOptions = {
  input: path.resolve(__dirname, "./app.js"),
}
const outputOptions = {
  dir: path.resolve(__dirname, "../dist"),
  format: "iife",
  plugins: [terser()],
}

async function build() {
  const bundle = await rollup.rollup(inputOptions)
  await bundle.write(outputOptions)
}

module.exports = build
