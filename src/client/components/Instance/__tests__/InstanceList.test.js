/* eslint-env jest */
import React from 'react'
import Enzyme from 'enzyme'
import { shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-16'
import { InstanceListContainer as InstanceList} from '../InstanceListContainer'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'

Enzyme.configure({ adapter: new Adapter() })

describe('InstanceListContainer', () => {
  const mockStore = configureStore()

  it('renders correctly', () => {

    let cleanHeader = jest.fn(),
      replaceHeaderTitle = jest.fn(),
      displayInstances = jest.fn()

    const InstanceListComponent = shallow(
      <InstanceList
        cleanHeader={cleanHeader}
        replaceHeaderTitle={replaceHeaderTitle}
        displayInstances={displayInstances}
      />
    ).dive().dive()
    expect(toJson(InstanceListComponent)).toMatchSnapshot()
  })

  describe('filters', () => {

    let cleanHeader = jest.fn(),
      replaceHeaderTitle = jest.fn(),
      displayInstances = jest.fn()

    const items = {
      '1': {
        companyName: 'centreon',
        fingerprint: 'fingerprint',
        serverName: 'centreon-server',
        subscriptionState: {
          instanceId: '1',
          slug: 'instance-unlink-1',
          state: false,
        },
        unlimitedAccess: {
          instanceId: '1',
          serverName: 'centreon-server',
          slug: 'instance-unlimited-1',
          unlimitedMode: false,
        },
      },
      '2': {
        companyName: 'centreon2',
        fingerprint: 'fingerprint2',
        serverName: 'centreon-server2',
        subscriptionState: {
          instanceId: '2',
          slug: 'instance-unlink-2',
          state: false,
        },
        unlimitedAccess: {
          instanceId: '2',
          serverName: 'centreon-server2',
          slug: 'instance-unlimited-2',
          unlimitedMode: false,
        },
      }
    }

    const storeWithItems = mockStore({
      authReducer: {
        token: ''
      },
      instanceReducer: {
        items: items,
        openConfirmDialog: false,
        totalPages: 2,
        totalItems: 4,
      },
      confirmDialogReducer: {
        slug: '',
        allowAction: false,
        open: false,
        content: {
          body: '',
          cancel: '',
          confirm: '',
        }
      }
    })

    const props = {
      token: '',
      items: items,
      totalPages: 2,
      totalItems: 4,
      cleanHeader: cleanHeader,
      replaceHeaderTitle: replaceHeaderTitle,
      displayInstances: displayInstances
    }

    it('Should filter by company name', () => {

      const InstanceListContainer = mount(
        <Provider store={storeWithItems}>
          <InstanceList {...props}/>
        </Provider>
      )

      InstanceListContainer
        .find('th#filterCompanyName input')
        .simulate('change', {target: { value: 'centreo' }})

      expect(InstanceListContainer.childAt(0).instance().state.filters)
        .toEqual([ { columnName: 'companyName', value: 'centreo' } ])
    })

    it('Should filter by fingerprint', () => {

      const InstanceListContainer = mount(
        <Provider store={storeWithItems}>
          <InstanceList {...props}/>
        </Provider>
      )

      InstanceListContainer
        .find('th#filterFingerprint input')
        .simulate('change', {target: { value: 'finger' }})

      expect(InstanceListContainer.childAt(0).instance().state.filters)
        .toEqual([ { columnName: 'fingerprint', value: 'finger' } ])
    })
  })
})