/* eslint-env jest */
import React from 'react'
import Enzyme from 'enzyme'
import { shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-16'
import { Notification } from 'Components/Notification'
import configureStore from 'redux-mock-store'

Enzyme.configure({ adapter: new Adapter() })

describe('Notification', () => {
  const mockStore = configureStore()
  const store = mockStore({
    notificationReducer: {
      notifications: {
        '1': {
          type: 'information',
          message: 'test notification',
          position: {
            vertical: 'bottom',
            horizontal: 'right'
          },
          timeout: 3000
        }
      }
    }
  })
  let component

  it('renders correctly', () => {
    component = shallow(
      <Notification
        store={store}
      />
    ).dive().dive().dive()
    expect(toJson(component)).toMatchSnapshot()
  })

  it('closes correctly', () => {
    let actions

    component = mount(
      <Notification
        store={store}
      />
    )
    component.find('button#closeNotification').simulate('click')
    actions = store.getActions()
    expect(actions[0].type).toBe('CLOSE_NOTIFICATION')
  })
})