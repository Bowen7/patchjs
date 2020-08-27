import Patch from "../src/index"
const target = document.createElement("div")
document.body.appendChild(target)

const com = new Patch({
  state() {
    return {
      count: 0,
    }
  },
  willUpdate(first) {
    console.log(11, first)
    if (first) {
      this.setState({
        count: 2,
      })
    }
  },
  addCount() {
    this.setState({
      count: this.state.count + 1,
    })
  },
  target,
  render() {
    return `
    <div>${this.state.count}</div>
    <button ref="key">click</button>
    `
  },
})
com.render()
