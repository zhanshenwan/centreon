/* eslint-env jest */
import React from 'react'
import Enzyme from 'enzyme'
import { shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-16'
import { LogoutItem } from 'Components/HeaderBar/AccountMenu/LogoutItem'
import configureStore from 'redux-mock-store'

Enzyme.configure({ adapter: new Adapter() })

describe('LogoutItem', () => {
  const mockStore = configureStore()
  const store = mockStore({})
  let component

  it('renders correctly', () => {
    component = shallow(
      <LogoutItem
        store={store}
      />
    ).dive().dive()
    expect(toJson(component)).toMatchSnapshot()
  })

  it('should logout when clicking on logout item', () => {
    component = mount(
      <LogoutItem
        store={store}
      />
    )

    component.find('div p').simulate('click')
    const actions = store.getActions()
    expect(actions[0].type).toBe('DISPLAY_NOTIFICATION')
    expect(actions[1].type).toBe('LOGOUT_SUCCESS')
  })
})