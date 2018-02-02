/* eslint-env jest */
import React from 'react'
import Enzyme from 'enzyme'
import { shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-16'
import configureStore from 'redux-mock-store'

Enzyme.configure({ adapter: new Adapter() })

// add mock for hub api
jest.mock('Services/hubApi', () => ({
  patchPluginPack: () => ({
    type: 'PATCH_PLUGIN_PACK_SUCCESS',
    catalogFormPopin: {
      open: false
    },
    item: {}
  })
}))
import { CatalogFormPopin } from 'Components/PluginPacks/CatalogFormPopin'

describe('CatalogFormPopin', () => {
  let mockStore = configureStore()
  let store
  let component

  it('renders correctly', () => {
    store = mockStore({
      authReducer: {
        token: ''
      },
      pluginPacksReducer: {
        catalogFormPopin: {
          open: false,
          id: null,
          level: null
        }
      }
    })
    component = shallow(
      <CatalogFormPopin
        store={store}
      />
    ).dive().dive().dive()
    expect(toJson(component)).toMatchSnapshot()
  })

  it('closes correctly', () => {
    let actions

    store = mockStore({
      authReducer: {
        token: ''
      },
      pluginPacksReducer: {
        catalogFormPopin: {
          open: true,
          id: 1,
          level: '2'
        }
      }
    })
    component = mount(
      <CatalogFormPopin
        store={store}
      />
    )
    component.find('button#confirmCatalogFormPopin').simulate('click')
    actions = store.getActions()
    expect(actions[0].type).toBe('CLOSE_CATALOG_FORM_POPIN')
  })
})