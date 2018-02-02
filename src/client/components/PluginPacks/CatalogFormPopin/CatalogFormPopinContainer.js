import React, { Component } from 'react'
import { connect } from 'react-redux'
import CatalogFormPopin from './CatalogFormPopin'
import { patchPluginPack } from 'Services/hubApi'
import { closeCatalogFormPopin } from 'Redux/pluginPacks/pluginPacksActions'

class CatalogFormPopinContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      open: props.open,
      level: props.level
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      open: nextProps.open,
      level: nextProps.level
    })
  }

  handleChange = (event, level) => {
    this.setState({ level: level })
  }

  handleCancel = () => {
    this.props.closeCatalogFormPopin()
  }

  handleConfirm = () => {
    const {token, id} = this.props
    const { level } = this.state

    this.props.closeCatalogFormPopin()
    this.props.patchPluginPack(token, id, level)
  }

  render = () => {
    const { open, level } = this.state

    return (
      <CatalogFormPopin
        handleChange={this.handleChange}
        handleCancel={this.handleCancel}
        handleConfirm={this.handleConfirm}
        open={open}
        level={level}
      />
    )
  }

}

const mapStateToProps = (store) => {
  return {
    token: store.authReducer.token,
    open: store.pluginPacksReducer.catalogFormPopin.open,
    id: store.pluginPacksReducer.catalogFormPopin.id,
    level: store.pluginPacksReducer.catalogFormPopin.level,
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    patchPluginPack: (token, pluginPackId, attributes) => {
      return dispatch(patchPluginPack(token, pluginPackId, attributes))
    },
    closeCatalogFormPopin: () => {
      return dispatch(closeCatalogFormPopin())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogFormPopinContainer)