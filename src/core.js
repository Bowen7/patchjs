class Patch {
  constructor(options = {}) {
    this.options = initOptions(this, options)
    initRefs(this)
    if (this.target) {
      this.doRender(true)
    }
  }
  doRender(firstRender = false) {
    firstRender ? callHook(this, "willMount") : callHook(this, "willUpdate")
    this.target.innerHTML = this.render()
    callHook(this, "didRender")
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
        return this.doRender()
      }
    } else {
      this.state = nextState
      this.doRender()
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
        return vm.options[propName]
      },
      set(val) {
        vm.options[propName] = val
      },
    })
  })
  return options
}

function callHook(vm, hook) {
  const handler = vm.options[hook]
  handler && handler.call(vm)
}
export default Patch
