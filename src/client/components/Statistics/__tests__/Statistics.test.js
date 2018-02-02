/* eslint-env jest */
import React from 'react'
import Enzyme from 'enzyme'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-16'
import { Statistics } from 'Components/Statistics'
import configureStore from 'redux-mock-store'

Enzyme.configure({ adapter: new Adapter() })

describe('Statistics', () => {
  const mockStore = configureStore()
  const store = mockStore({})
  let component

  it('renders correctly', () => {
    component = shallow(
      <Statistics
        match={{path: '/app'}}
        store={store}
      />
    ).dive().dive().dive()
    expect(toJson(component)).toMatchSnapshot()
  })
})