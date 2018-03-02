import React, { Component } from 'react'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import TopHeader from '../Components/Header/TopHeader'


const theme = createMuiTheme({
  palette: {
    primary: { main: '#88b917' },
    secondary: { main: '#00bfb3' },
    error: { main: '#e00b3d' },
    warning: { main: '#ff9a13' },
  },
  font: {
    openSans: "'Open Sans', Arial, Tahoma, Helvetica, Sans-Serif"
  },
  overrides: {
    MuiButton: {

    }
  }
});

class TopHeaderContainer extends Component {

  render = () => {
    const object = ['host', 'service']
    return (
      <MuiThemeProvider theme={theme}>
        <TopHeader object={object} />
      </MuiThemeProvider>
    )
  }
}

export default TopHeaderContainer