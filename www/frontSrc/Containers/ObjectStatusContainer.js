import React, { Component } from 'react'
import ObjectStatus from '../Components/Header/ObjectStatus'

class ObjectStatusContainer extends Component {

  render = () => {

    const { object } = this.props

    return (
      <ObjectStatus object={object} />
    )
  }
}

export default ObjectStatusContainer