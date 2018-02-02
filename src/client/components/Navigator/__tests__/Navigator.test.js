/* eslint-env jest */
import React from 'react'
import Enzyme from 'enzyme'
import { shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-16'
import { Navigator } from 'Components/Navigator'
import ComputerIcon from 'material-ui-icons/Computer'
import FilterNoneIcon from 'material-ui-icons/FilterNone'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import configureStore from 'redux-mock-store'
import createHistory from "history/createBrowserHistory"

Enzyme.configure({ adapter: new Adapter() })

describe('Navigator', () => {
  let mockStore = configureStore()
  let store = mockStore({
    notificationReducer: {
      notifications: {}
    }
  })
  let history = createHistory()
  let component
  let entries = [
    {
      name: 'Instances',
      path: '/app/instances',
      icon: (
        <ComputerIcon style={{
          fill: '#A7A9AC',
          width: '26px',
          height: '26px',
        }} />
      ),
    },
    {
      name: 'Plugin Packs',
      path: '/app/pluginpacks',
      icon: (
        <FilterNoneIcon style={{
          fill: '#A7A9AC',
          width: '26px',
          height: '26px',
        }} />
      ),
    },
  ]

  beforeEach(() => {
    component = shallow(
      <Navigator
        store={store}
        entries={entries}
      />
    ).dive().dive()
  })

  it('renders correctly', () => {
    expect(toJson(component)).toMatchSnapshot()
  })

  it('opens correctly', () => {
    component = mount(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Navigator
            entries={entries}
          />
        </ConnectedRouter>
      </Provider>
    )
    component.find('#openMenu svg').simulate('click')
  })
})