import React, { Component } from 'react'
import { connect } from 'react-redux'
import CatalogSelector from './CatalogSelector'
import { openCatalogFormPopin } from 'Redux/pluginPacks/pluginPacksActions'

class CatalogSelectorContainer extends Component {

  handleClick = () => {
    const { id, level } = this.props
    this.props.openCatalogFormPopin(id, level)
  }

  render = () => {
    const { level } = this.props

    return (
      <CatalogSelector
        handleClick={this.handleClick}
        level={level}
      />
    )
  }
}

const mapStateToProps = (store) => {
  return {}
}


const mapDispatchToProps = (dispatch) => {
  return {
    openCatalogFormPopin: (pluginPackId, level) => {
      return dispatch(openCatalogFormPopin(pluginPackId, level))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogSelectorContainer)