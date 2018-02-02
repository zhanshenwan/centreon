/* eslint-env jest */
import React from 'react'
import Enzyme from 'enzyme'
import { shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-16'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { PluginPacksList } from 'Components/PluginPacks'
import configureStore from 'redux-mock-store'
import createHistory from 'history/createBrowserHistory'


Enzyme.configure({ adapter: new Adapter() })

describe('PluginPacksList', () => {
  const mockStore = configureStore()
  let component

  it('renders correctly', () => {
    const store = mockStore({
      pluginPacksReducer: {
        items: {},
        catalogFormPopin: {
          open: false,
          id: null,
          level: null
        }
      }
    })

    component = shallow(
      <PluginPacksList.WrappedComponent
        store={store}
        cleanHeader={jest.fn()}
        replaceHeaderTitle={jest.fn()}
        displayPluginPacks={jest.fn()}
      />
    ).dive().dive()
    expect(toJson(component)).toMatchSnapshot()
  })

  describe('events', () => {
    const storeWithItems = mockStore({
      authReducer: {
        username: '',
        token: '',
      },
      pluginPacksReducer: {
        items: {
          '1': {
            order: 0,
            catalog_level: 1,
            id: 1,
            name: "pp 1",
            released: true,
            slug: "pp-1",
            version: "1.0.0"
          },
          '2': {
            order: 1,
            catalog_level: 2,
            id: 2,
            name: "pp 2",
            released: false,
            slug: "pp-2",
            version: "1.0.1"
          }
        },
        catalogFormPopin: {
          open: false,
          id: null,
          level: null
        },
        totalPages: 2,
        totalItems: 4,
      },
      confirmDialogReducer: {
        id: null,
        open: false,
        content: {
          body: '',
          cancel: '',
          confirm: '',
        },
        items: {}
      }
    })

    let cleanHeaderMock, replaceHeaderTitleMock, displayPluginPacksMock

    beforeEach(() => {
      cleanHeaderMock = jest.fn()
      replaceHeaderTitleMock = jest.fn()
      displayPluginPacksMock = jest.fn()
      const props = {
        token: '',
        items: {
          '1': {
            order: 0,
            catalog_level: 1,
            id: 1,
            name: "pp 1",
            released: true,
            slug: "pp-1",
            version: "1.0.0"
          },
          '2': {
            order: 1,
            catalog_level: 2,
            id: 2,
            name: "pp 2",
            released: false,
            slug: "pp-2",
            version: "1.0.1"
          }
        },
        totalPages: 2,
        totalItems: 4,
        cleanHeader: cleanHeaderMock,
        replaceHeaderTitle: replaceHeaderTitleMock,
        displayPluginPacks: displayPluginPacksMock
      }
      component = mount(
        <Provider store={storeWithItems}>
          <PluginPacksList.WrappedComponent
            {...props}
          />
        </Provider>
      )
    })

    it('filters on slug', () => {
      component.find('th#filterSlug input').simulate('change', {target: { value: 'pp' }})
      expect(component.childAt(0).instance().state.filters).toEqual([ { columnName: 'slug', value: 'pp' } ])
      expect(displayPluginPacksMock.mock.calls.length).toBe(2)
      expect(displayPluginPacksMock.mock.calls[1][1]).toEqual('filter[slug]=pp')
    })

    it('filters on name', () => {
      component.find('th#filterName input').simulate('change', {target: { value: 'network cisco' }})
      expect(component.childAt(0).instance().state.filters).toEqual([ { columnName: 'name', value: 'network cisco' } ])
      expect(displayPluginPacksMock.mock.calls.length).toBe(2)
      expect(displayPluginPacksMock.mock.calls[1][1]).toEqual('filter[name]=network cisco')
    })

    it('filters on catalog', () => {
      component.find('th#filterCatalog div[role="button"]').simulate('click')
      component.find('li#filterCatalog2').simulate('click')
      expect(component.childAt(0).instance().state.filters).toEqual([ { columnName: 'catalog_level', value: '2' } ])
      expect(displayPluginPacksMock.mock.calls.length).toBe(2)
      expect(displayPluginPacksMock.mock.calls[1][1]).toEqual('filter[catalog_level]=2')
    })

    it('filters on released', () => {
      component.find('th#filterReleased div[role="button"]').simulate('click')
      component.find('li#filterReleasedReleased').simulate('click')
      expect(component.childAt(0).instance().state.filters).toEqual([ { columnName: 'released', value: 'true' } ])
      expect(displayPluginPacksMock.mock.calls.length).toBe(2)
      expect(displayPluginPacksMock.mock.calls[1][1]).toEqual('filter[released]=true')
    })

    it('changes page', () => {
      /* TODO */
    })
  })
})