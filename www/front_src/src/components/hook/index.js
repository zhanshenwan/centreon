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

  scriptLoaded = (url) => {
    console.log('loaded')
    url = './components/hooks/header/index.js'
    //url = 'BamHeader'
    //import(url)
    /*
    console.log(window["webpackJsonpBamHeader"])
    console.log(window["webpackJsonpBamHeader"][0][1])
    window["webpackJsonpBamHeader"][0][1]["./components/hooks/header/index.js"]()
    */
    console.log(window["webpackJsonplib"])
  }

  getComponents = (urls) => {
    for (const url of urls) {
      let script = document.createElement("script")
      script.src = url
      script.onreadystatechange = () => { this.scriptLoaded(url) }
      script.onload = () => { this.scriptLoaded(url) }
      document.head.appendChild(script)
      /*
      let toto = './components/hooks/header/index.js'
      toto = 'BamHeader'
      import(toto).then(() => {
        console.log('import ok')
      })
      */
    }
    /*
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
      */
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
