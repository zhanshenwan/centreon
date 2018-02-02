import {
  REQUEST_AUTH,
  REQUEST_AUTH_SUCCESS,
  REQUEST_AUTH_FAIL,
  LOGOUT_SUCCESS,
} from 'Redux/auth/authActions'


export default function authReducer (
  state = {
    authLoading: false,
    isLogged: false,
    username: '',
    error: {}
  },
  action
) {

  switch (action.type) {
    case REQUEST_AUTH:
      return {
        ...state,
        authLoading: true,
        isLogged: false,
        username: action.username
      }
    case REQUEST_AUTH_SUCCESS:
      return {
        ...state,
        token: action.token,
        authLoading: false,
        isLogged: true,
      }
    case REQUEST_AUTH_FAIL:
    case LOGOUT_SUCCESS:
      return {
        ...state,
        error: {
          code: action.error.code,
          message: action.error.message
        },
        authLoading: false,
        isLogged: false,
      }
    default:
      return state
  }
}