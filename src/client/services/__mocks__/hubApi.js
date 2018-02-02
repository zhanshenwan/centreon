import {
  releasePluginPack,
  releasePluginPackSuccess
} from 'Redux/pluginPacks/pluginPacksActions'
import {
  displayNotification,
} from 'Redux/notification/notificationActions'

export function patchPluginPackReleased (token, id, version) {
  return (dispatch) => {
    dispatch(releasePluginPack())
    dispatch(displayNotification('Plugin pack has been released'))
    dispatch(releasePluginPackSuccess(
      {
        data: {
          data: {
            id: 1
          }
        }
      }
    ))
  }
}