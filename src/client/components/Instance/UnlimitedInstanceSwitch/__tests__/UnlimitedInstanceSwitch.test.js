/* eslint-env jest */
import React from 'react'
import Enzyme from 'enzyme'
import { mount, shallow, render } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-16'
import { UnlimitedInstanceSwitch } from 'Components/Instance/UnlimitedInstanceSwitch'
import { ConfirmDialog } from 'Components/ConfirmDialog'
import configureStore from 'redux-mock-store'

Enzyme.configure({ adapter: new Adapter() })

describe('UnlimitedInstanceSwitch', () => {
  const mockStore = configureStore()
  const store = mockStore({
    authReducer: {
      token: ''
    },
    confirmDialogReducer: {
      allowAction: false,
      slug: null,
      open: true,
      content: {
        body: 'message',
        cancel: 'cancel',
        confirm: 'confirm',
      },
    },
    instanceReducer: {
      items: {
        "1": {
          unlimitedAccess: {
            instanceId: "1",
            serverName: "centreon",
            slug:"instance-unlimited-1",
            unlimitedMode: true
          }
        }
      }
    }
  })

  it('Render button switch correctly', () => {

    const UnlimitedInstanceSwitchContainer = shallow(
      <UnlimitedInstanceSwitch
        store={store}
        instanceId="1"
      />
    )
    expect(toJson(UnlimitedInstanceSwitchContainer)).toMatchSnapshot()
  })

  it('Opens dialog on switch', () => {

    const UnlimitedInstanceSwitchContainer = mount(
      <UnlimitedInstanceSwitch
        store={store}
        instanceId="1"
      />
    )

    UnlimitedInstanceSwitchContainer
      .find('span#switch-1 input[type="checkbox"]')
      .simulate('change')

    const actions = store.getActions()

    expect(actions[0].type).toEqual('OPEN_CONFIRM_DIALOG')
  })

  it('Switch correctly on confirm', () => {
    const allowedSlug = "instance-unlimited-1"

    const UnlimitedInstanceSwitchContainer = mount(
      <UnlimitedInstanceSwitch
        store={store}
        instanceId="1"
        checked={0}
        allowAction={false}
        slug=""
        allowedSlug=""
      />
    )

    UnlimitedInstanceSwitchContainer
      .setProps({
        allowAction: true,
        checked: 1,
        allowedSlug: allowedSlug,
        slug: allowedSlug
      })
  })
})