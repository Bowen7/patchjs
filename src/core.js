class Patch {
  constructor(options = {}) {
    this.options = initOptions(this, options)
    this.__firstRender__ = true
    initRefs(this)
  }
  doRender() {
    callHook(this, "willUpdate", this.__firstRender__)
    this.target.innerHTML = this.render()
    callHook(this, "didUpdate", this.__firstRender__)
    this.__firstRender__ = false
  }
  setState(newState) {
    const nextState = {
      ...this.state,
      ...newState,
    }
    if (this.shouldUpdate) {
      const shouldUpdate = this.shouldUpdate(nextState)
      this.state = nextState
      if (shouldUpdate) {
        return this.render()
      }
    } else {
      this.state = nextState
      this.render()
    }
  }
}

function initRefs(vm) {
  vm.refs = new Proxy(
    {},
    {
      get(obj, prop) {
        return document.querySelector(`[ref=${prop}]`)
      },
    }
  )
}
function initOptions(vm, options) {
  const stateFactory = options.state
  let state = {}
  if (stateFactory) {
    state = stateFactory()
  }
  options.state = state

  Object.keys(options).forEach(propName => {
    Object.defineProperty(vm, propName, {
      get() {
        // special prop
        if (propName === "render") {
          return this.doRender
        }
        return vm.options[propName]
      },
      set(val) {
        vm.options[propName] = val
      },
    })
  })
  return options
}

function callHook(vm, hook, ...rest) {
  const handler = vm.options[hook]
  handler && handler.call(vm, ...rest)
}
export default Patch
