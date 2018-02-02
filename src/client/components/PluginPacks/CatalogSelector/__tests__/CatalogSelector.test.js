/* eslint-env jest */
import React from 'react'
import Enzyme from 'enzyme'
import { shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-16'
import configureStore from 'redux-mock-store'

Enzyme.configure({ adapter: new Adapter() })

import { CatalogSelector } from 'Components/PluginPacks/CatalogSelector'

describe('CatalogSelector', () => {
  const mockStore = configureStore()
  const store = mockStore({})
  let component

  it('renders correctly', () => {
    component = shallow(
      <CatalogSelector
        store={store}
        level='2'
      />
    ).dive().dive().dive()
    expect(toJson(component)).toMatchSnapshot()
  })

  it('opens catalof form popin correctly', () => {
    let actions

    component = mount(
      <CatalogSelector
        store={store}
        level='2'
      />
    )
    component.find('div').simulate('click')
    actions = store.getActions()
    expect(actions[0].type).toBe('OPEN_CATALOG_FORM_POPIN')
  })
})