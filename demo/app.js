import Patch from "../src/index"
const target = document.createElement("div")
document.body.appendChild(target)

const com = new Patch({
  state() {
    return {
      count: 0,
    }
  },
  willMount() {
    console.log("will mount")
  },
  willUpdate() {
    console.log("will update")
    this.refs["key"].removeEventListener("click", this.addCount.bind(this))
  },
  didRender() {
    console.log("will render")
    this.refs["key"].addEventListener("click", this.addCount.bind(this))
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
