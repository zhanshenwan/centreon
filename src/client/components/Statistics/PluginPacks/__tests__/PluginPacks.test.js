/* eslint-env jest */
import React from 'react'
import Enzyme from 'enzyme'
import { shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-16'
import { PluginPacksContainer as PluginPacks } from 'Components/Statistics/PluginPacks/PluginPacksContainer'
import configureStore from 'redux-mock-store'

Enzyme.configure({ adapter: new Adapter() })

describe('Plugin Packs Statistics', () => {
  const mockStore = configureStore()
  const getPluginPacksStatistics = jest.fn()
  const getPluginPackStatistics = jest.fn()
  const props = {
    getPluginPacksStatistics: jest.fn(),
    getPluginPackStatistics: jest.fn(),
    token: '',
    loading: false,
    slug: 'pp2',
    pluginPacksStatistics: {
      'pp1': {
        totalInstalled: 17,
        totalUpdated: 5,
        versions: {
          '1.0.0': {
              totalInstalled: 3,
              totalUpdated: 0
          }
        }
      },
      'pp2': {
        totalInstalled: 7,
        totalUpdated: 1,
        versions: {
          '1.0.0': {
            totalInstalled: 1,
            totalUpdated: 0
          },
          '1.0.1': {
            totalInstalled: 6,
            totalUpdated: 1
          }
        }
      }
    }
  }
  let component

  it('renders correctly', () => {
    component = shallow(
      <PluginPacks
        {...props}
      />
    ).dive().dive()
    expect(toJson(component)).toMatchSnapshot()
  })

  it('formats plugin packs stats correctly', () => {
    let stats
    const expectedTitle = 'All plugin packs',
      expectedLabels = [ 'pp1', 'pp2' ],
      expectedData1 = [
        props.pluginPacksStatistics['pp1'].totalInstalled,
        props.pluginPacksStatistics['pp2'].totalInstalled,
      ],
      expectedData2 = [
        props.pluginPacksStatistics['pp1'].totalUpdated,
        props.pluginPacksStatistics['pp2'].totalUpdated,
      ]

    component = mount(
      <PluginPacks
        {...props}
      />
    )

    stats = component.instance().formatPluginPacksStatistics()

    expect(stats.title).toEqual(expectedTitle)
    expect(stats.labels).toEqual(expectedLabels)
    expect(stats.datasets[0].data).toEqual(expectedData1)
    expect(stats.datasets[1].data).toEqual(expectedData2)
  })

  it('formats plugin pack stats correctly', () => {
    let stats
    const expectedTitle = 'pp2',
      expectedLabels = [ '1.0.0', '1.0.1' ],
      expectedData1 = [
        props.pluginPacksStatistics['pp2'].versions['1.0.0'].totalInstalled,
        props.pluginPacksStatistics['pp2'].versions['1.0.1'].totalInstalled,
      ],
      expectedData2 = [
        props.pluginPacksStatistics['pp2'].versions['1.0.0'].totalUpdated,
        props.pluginPacksStatistics['pp2'].versions['1.0.1'].totalUpdated,
      ]


    component = mount(
      <PluginPacks
        {...props}
      />
    )

    stats = component.instance().formatPluginPackStatistics()

    expect(stats.title).toEqual(expectedTitle)
    expect(stats.labels).toEqual(expectedLabels)
    expect(stats.datasets[0].data).toEqual(expectedData1)
    expect(stats.datasets[1].data).toEqual(expectedData2)
  })
})