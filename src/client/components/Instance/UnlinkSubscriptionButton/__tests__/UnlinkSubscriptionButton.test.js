/* eslint-env jest */
import React from 'react'
import Enzyme from 'enzyme'
import { mount, shallow, render } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-16'
import { UnlinkSubscriptionButton } from 'Components/Instance/UnlinkSubscriptionButton'
import { ConfirmDialog } from 'Components/ConfirmDialog'
import configureStore from 'redux-mock-store'

Enzyme.configure({ adapter: new Adapter() })

describe('UnlinkSubscriptionButton', () => {
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

    const UnlinkSubscriptionButtonContainer = shallow(
      <UnlinkSubscriptionButton
        store={store}
        instanceId="1"
      />
    )
    expect(toJson(UnlinkSubscriptionButtonContainer)).toMatchSnapshot()
  })

  it('Opens dialog on click', () => {

    const UnlinkSubscriptionButtonContainer = mount(
      <UnlinkSubscriptionButton
        store={store}
        instanceId="1"
      />
    )

    UnlinkSubscriptionButtonContainer
      .find('button#unlink-1')
      .simulate('click')

    const actions = store.getActions()

    expect(actions[0].type).toEqual('OPEN_CONFIRM_DIALOG')
  })

  it('link correctly on confirm', () => {
    const allowedSlug = "instance-unlink-1"

    const UnlinkSubscriptionButtonContainer = mount(
      <UnlinkSubscriptionButton
        store={store}
        instanceId="1"
        allowAction={false}
        slug=""
        allowedSlug=""
      />
    )

    UnlinkSubscriptionButtonContainer
      .setProps({
        allowAction: true,
        allowedSlug: allowedSlug,
        slug: allowedSlug
      })
  })
})