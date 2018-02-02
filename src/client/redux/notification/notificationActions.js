export const DISPLAY_NOTIFICATION = 'DISPLAY_NOTIFICATION'
export const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION'

export function displayNotification (notification) {
  const type = notification.type ? notification.type : 'information'
  const defaultTimeout = {
    'information': 3000,
    'warning': 5000,
    'error': null
  }
  const timeout = notification.timeout ? notification.timeout : defaultTimeout[type]

  return {
    type: DISPLAY_NOTIFICATION,
    notification: {
      type: type,
      message: notification.message,
      position: {
        vertical: notification.position && notification.position.vertical ?
          notification.position.vertical : 'bottom',
        horizontal: notification.position && notification.position.horizontal ?
          notification.position.horizontal : 'right'
      },
      timeout: timeout
    }
  }
}

export function closeNotification (id) {
  return {
    type: CLOSE_NOTIFICATION,
    id: id
  }
}