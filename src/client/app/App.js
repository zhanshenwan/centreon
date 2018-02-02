import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { store, persistor } from 'Redux/AppStore'
import AppRouter from 'App/AppRouter'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'

const theme = createMuiTheme({
  palette: {
    type: 'light'
  }
})

class App extends Component {
  componentWillMount () {
    document.body.style.position = 'absolute'
    document.body.style.width = '100%'
    document.body.style.height = '100%'
    document.body.style.margin = '0'
  }

  render () {
    return (
      <table cellpadding="0" cellspacing="0" border="0">
	<tr>
        <td>
				<table class='Resume_light_table'>
					<tr>
						<th>Poller States</th>
						<td>
							<span id='latency' >
								<img src='./img/icons/clock.png' class="ico-10" id="img_latency" />
							</span>
						</td>
						<td>
							<span id="pollingState">
								<img src='./img/icons/poller.png' class="ico-10" id="img_pollingState"/>
							</span>
						</td>
						<td>
							<span id="activity">
								<img src='./img/icons/database.png' class="ico-10" id="img_activity" />
							</span>
						</td>
					</tr>
				</table>
			</td>
<td>
				<table class='Resume_light_table'>
					<tr>
						<th>
							<span id="hosts">?</span>Hosts
						</th>
						<td>
							<span id="host_up" class="host_up" >?</span>
						</td>
						<td>
							<span id="host_down" class="host_down" >?</span>
						</td>
						<td>
							<span id="host_unreachable" class="host_unreachable">?</span>
						</td>
						<td>
							<span id="host_pending" class="pending">?</span>
						</td>

					</tr>
				</table>
			</td>
			<td>
				<table class='Resume_light_table'>
					<tr>
						<th>
							<span id="service_total">?</span>Services
						</th>
						<td>
							<span id="service_ok" class="service_ok">?</span>
						</td>
						<td>
							<span id="service_warning" class="service_warning">?</span>
						</td>
						<td>
							<span id="service_critical" class="service_critical">?</span>
						</td>
                <td>
                  <span id="service_unknown" class="service_unknown">?</span>
                </td>
                <td>
                  <span id="service_pending" class="pending">?</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    )
/*
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <MuiThemeProvider theme={theme}>
            <AppRouter />
          </MuiThemeProvider>
        </PersistGate>
      </Provider>
    )
*/
  }
}

export default App
