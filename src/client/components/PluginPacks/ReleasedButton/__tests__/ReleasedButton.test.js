/* eslint-env jest */
import React from 'react'
import Enzyme from 'enzyme'
import { shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-16'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

Enzyme.configure({ adapter: new Adapter() })

// add mock for hub api
jest.mock('../../../../services/hubApi')
import * as hubApi from '../../../../services/hubApi'

import { ReleasedButton } from 'Components/PluginPacks/ReleasedButton'
import { default as ReleasedButtonDumb } from 'Components/PluginPacks/ReleasedButton/ReleasedButton'

describe('ReleasedButton', () => {
  const mockStore = configureStore([thunk])
  const store = mockStore({
    authReducer: {
      token: ''
    },
    confirmDialogReducer: {
      items: {}
    },
    pluginPacksReducer: {
      items: {
        "1": {
          version: "1.0.0",
          released: false,
          catalog_level: "1"
        }
      }
    }
  })
  let wrapper, dumb

  describe('state provided by the store', () => {
    beforeEach(() => {
      wrapper = mount(
        <ReleasedButton
          store={store}
          pluginPackId="1"
        />
      )
      dumb = wrapper.find(ReleasedButtonDumb)
    })

    it('passes down released value', () => {
      expect(dumb.prop("released")).toEqual(false)
    })
  })

  describe('actions passes down by the store', () => {
    let storeDispatchSpy, patchPluginPackReleasedSpy

    beforeEach(() => {
      storeDispatchSpy = jest.spyOn(store, 'dispatch')
      patchPluginPackReleasedSpy = jest.spyOn(hubApi, 'patchPluginPackReleased')
      wrapper = mount(
        <ReleasedButton
          store={store}
          pluginPackId="1"
        />
      )
      dumb = wrapper.find(ReleasedButtonDumb)
    })

    it('passes down the action to release the plugin pack', function() {
      dumb.find('span#released1').simulate('click')

      const actions = store.getActions()
      expect(actions[0].type).toBe('OPEN_CONFIRM_DIALOG')
    })
  })
})