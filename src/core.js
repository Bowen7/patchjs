class Patch {
  constructor(options = {}) {
    this.options = initOptions(this, options)
    this.__firstRender__ = true
    this.__newState__ = {}
    initRefs(this)
  }
  // if has no target, the component is child component
  render(props) {
    if (!this.target) {
      return this.options.render(props)
    }
    callHook(this, "willUpdate", this.__firstRender__)
    this.target.innerHTML = this.options.render()
    callHook(this, "didUpdate", this.__firstRender__)
    this.__firstRender__ = false
  }
  setState(newState) {
    this.__newState__ = {
      ...this.__newState__,
      ...newState,
    }
    Promise.resolve().then(() => {
      const nextState = {
        ...this.state,
        ...this.__newState__,
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
    })
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
    if (propName === "render") {
      return
    }
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

function callHook(vm, hook, ...rest) {
  const handler = vm.options[hook]
  handler && handler.call(vm, ...rest)
}
export default Patch
