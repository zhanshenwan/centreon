/* eslint-env jest */
import React from 'react'
import Enzyme from 'enzyme'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-16'
import { HeaderBarContainer as HeaderBar } from 'Components/HeaderBar/HeaderBarContainer'

Enzyme.configure({ adapter: new Adapter() })

describe('HeaderBar', () => {
  let component
  const props = {
    location: {
      pathname: '/app/instances'
    },
    title: '',
    entries: {}
  }

  it('renders correctly', () => {
    component = shallow(
      <HeaderBar {...props}/>
    ).dive().dive()
    expect(toJson(component)).toMatchSnapshot()
  })
})