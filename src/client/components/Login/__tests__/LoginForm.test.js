/* eslint-env jest */
import React from 'react';
import Enzyme from 'enzyme';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import LoginForm from '../LoginForm';

Enzyme.configure({ adapter: new Adapter() });

describe('LoginForm', () => {
  it('renders auth form correctly', () => {
    const login = shallow(
      <LoginForm
        user={{ username: 'user1', password: 'password1' }}
        onSubmit={() => {}}
      />,
    );
    expect(toJson(login)).toMatchSnapshot();
  });

  it('submit form', () => {
    let userSubmitted;

    const login = mount(
      <LoginForm
        user={{ username: 'user1', password: 'password1' }}
        onSubmit={(user) => { userSubmitted = user; }}
      />,
    );

    login.find('form').simulate('submit');
    expect(userSubmitted).toEqual({
      username: 'user1',
      password: 'password1',
    });
  });

  it('change form', () => {
    let userChanged;
    const login = mount(
        <LoginForm
          user={{ username: 'user0', password: 'password0' }}
          onSubmit={(user) => { userChanged = user; }}
        />,
    );

    login.find('input#username').simulate('change', {target: {name: 'username', value: 'user1'}})
    login.find('input#password').simulate('change', {target: {name: 'password', value: 'password1'}})
    login.find('form').simulate('submit')

    expect(userChanged).toEqual({
      username: 'user1',
      password: 'password1',
    });
  });
});