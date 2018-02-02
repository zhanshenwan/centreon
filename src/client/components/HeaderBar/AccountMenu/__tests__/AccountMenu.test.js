/* eslint-env jest */
import React from 'react'
import Enzyme from 'enzyme'
import { shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-16'
import { AccountMenu } from 'Components/HeaderBar/AccountMenu'
import configureStore from 'redux-mock-store'

Enzyme.configure({ adapter: new Adapter() })

describe('AccountMenu', () => {
  const mockStore = configureStore()
  const store = mockStore({
    authReducer: {
      username: 'user name'
    }
  })
  let component

  it('renders correctly', () => {
    component = shallow(
      <AccountMenu
        store={store}
      />
    ).dive().dive()
    expect(toJson(component)).toMatchSnapshot()
  })

  it('should display account menu when clicking on menu icon', () => {
    component = mount(
      <AccountMenu
        store={store}
      />
    )

    expect(component.find('div#accountMenuContent').length).toEqual(0)
    component.find('button#accountMenuButton').simulate('click')
    expect(component.find('div#accountMenuContent').length).toEqual(1)
  })
})