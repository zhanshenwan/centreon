/* eslint-env jest */
import React from 'react'
import Enzyme from 'enzyme'
import { mount, shallow, render } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-16'
import { ConfirmDialog } from 'Components/ConfirmDialog'
import configureStore from 'redux-mock-store'

Enzyme.configure({ adapter: new Adapter() })

describe('ConfirmDialog', () => {
  const mockStore = configureStore()
  const store = mockStore({
    confirmDialogReducer: {
      slug: 'centreon',
      allowAction: false,
      open: true,
      content: {
        body: 'message',
        cancel: 'cancel',
        confirm: 'confirm',
      },
    }
  })

  it('Opens dialog correctly', () => {

    const ConfirmDialogContainer = shallow(
      <ConfirmDialog store={store} slug="centreon"/>
    )

    expect(toJson(ConfirmDialogContainer)).toMatchSnapshot()
  })

  it('Cancel button works correctly', () => {
    const ConfirmDialogContainer = mount(
      <ConfirmDialog store={store} slug="centreon"/>,
    )

    ConfirmDialogContainer
      .find('button#cancelBtn')
      .simulate('click')

    const actions = store.getActions()
    expect(actions[0].type).toEqual('RESET_ACTION')
  })

  it('Confirm button works correctly', () => {

    const ConfirmDialogContainer = mount(
      <ConfirmDialog store={store} slug="centreon"/>,
    )

    ConfirmDialogContainer
      .find('button#confirmBtn')
      .simulate('click')

    const actions = store.getActions()
    expect(actions[1].type).toEqual('CONFIRM_ACTION')
  })
})