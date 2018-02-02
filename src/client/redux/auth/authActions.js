
export const REQUEST_AUTH = 'REQUEST_AUTH'

export const REQUEST_AUTH_SUCCESS = 'REQUEST_AUTH_SUCCESS'

export const REQUEST_AUTH_FAIL = 'REQUEST_AUTH_FAIL'

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'

export function requestAuth (user) {
  return {
    type: REQUEST_AUTH,
    username: user.username,
  }
}

export function requestAuthSuccess (res) {
  return {
    type: REQUEST_AUTH_SUCCESS,
    token: res.data.token
  }
}

export function requestAuthFail (err) {
  return {
    type: REQUEST_AUTH_FAIL,
    error: err,
  }
}

export function logoutSuccess (err) {
  return {
    type: LOGOUT_SUCCESS,
    error: err,
  }
}