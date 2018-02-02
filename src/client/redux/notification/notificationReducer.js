import {
  DISPLAY_NOTIFICATION,
  CLOSE_NOTIFICATION,
} from 'Redux/notification/notificationActions'

export default function notificationReducer (
  state = {
    notifications: {}
  },
  action
) {

  switch (action.type) {
    case DISPLAY_NOTIFICATION:
      return {
        ...state,
        notifications: {
          ...state.notifications,
          [Object.keys(state.notifications).length]:action.notification
        }
      }
    case CLOSE_NOTIFICATION:
      return {
        ...state,
        notifications: Object.keys(state.notifications).reduce((acc, key) => {
          if (key !== action.id) {
            return {...acc, [key]: state.notifications[key]}
          }
          return acc;
        }, {})
      }
    default:
      return state
  }

}