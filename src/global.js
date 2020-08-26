function initGlobal() {
  // add global array function to generate template
  Array.prototype.forChild = function (handler) {
    return this.map(handler).join("")
  }
}
export { initGlobal }
