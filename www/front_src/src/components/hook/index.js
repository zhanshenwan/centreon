import React, { Component } from "react"
import axios from "../../axios"

class Hook extends Component {

  state = {
    components: []
  }

  componentDidMount() {
    const { fish } = this.props

    axios("internal.php?object=centreon_hook&action=hooks&fish=" + fish)
      .get()
      .then(({data}) => {
        this.getComponents(data)
      }).catch((error) => {
        console.log(error)
      })
  }

  getComponents = (type) => {
    fetch(type)
      .then(response => response.text())
      .then(source => {
        var exports = {}
        function require(name) {
          if (name == 'react') {
            return React
          } else {
            throw `You can't use modules other than "react" in remote component : ${name} used`
          }
        }
        eval(source)
        this.setState({components: [exports]})
      })
  }

  render() {
    const { components } = this.state

    return (
      <>
      {components.map(Component => {
        return <Component/>
      })}
      </>
    )
  }
}

export default Hook
