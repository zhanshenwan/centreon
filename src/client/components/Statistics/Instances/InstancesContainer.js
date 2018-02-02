import React, { Component } from 'react'
import { connect } from 'react-redux'
import Instances from './Instances'

class InstancesContainer extends Component {
  render = () => {
    return (
      <Instances/>
    )
  }
}

const mapStateToProps = (store) => {
  return {
    token: store.authReducer.token,
  }
}


const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(InstancesContainer)