import axios from 'axios'
import {
  requestAuth,
  requestAuthSuccess,
  requestAuthFail,
  logoutSuccess
} from 'Redux/auth/authActions'
import { Config } from '../../../config'
import {
  requestInstances,
  requestInstancesSuccess,
  requestInstancesFail,
  updateInstance,
  updateInstanceSuccess,
  updateInstanceFail
} from 'Redux/instance/instanceActions'
import {
  requestPluginPacks,
  requestPluginPacksSuccess,
  requestPluginPacksFail,
  patchPluginPackSuccess,
  releasePluginPack,
  releasePluginPackSuccess
} from 'Redux/pluginPacks/pluginPacksActions'
import { displayNotification } from 'Redux/notification/notificationActions'
import { resetAction } from 'Redux/confirmDialog/confirmDialogActions'
import {
  requestPluginPacksStatistics,
  requestPluginPacksStatisticsSuccess,
  requestPluginPacksStatisticsFail,
  requestPluginPackStatistics,
  requestPluginPackStatisticsSuccess,
  requestPluginPackStatisticsFail
} from 'Redux/statistics/statisticsActions'
import { store } from 'Redux/AppStore'

const apiUrl = Config.apiUrl

axios.interceptors.response.use(null, function (err) {
  if (err.response.status === 401) {
    store.dispatch(logoutSuccess(err.response.data))
  }
  return Promise.reject(err)
})

export function auth (user) {
  const url = `${apiUrl}/auth/backoffice`

  return (dispatch) => {
    dispatch(requestAuth(user))

    axios.post(url, user)
      .then(
        response => {
          dispatch(displayNotification({message: 'Login success', timeout: 2000}))
          dispatch(requestAuthSuccess(response))
        }
      )
      .catch(
        error => {
          dispatch(displayNotification({type: 'error', message: 'Login failed', timeout: 5000}))
          dispatch(requestAuthFail(error.response.data))
        }
      )
  }
}

export function getInstances (pagination, filters, token) {
  let url = `${apiUrl}/license-manager/instance`
  url += pagination

  if (filters) {
    url += '&' + filters
  }

  return (dispatch) => {
    dispatch(requestInstances())

    return axios.get(
      url,
      {
        headers: {
          'centreon-imp-token': token
        }
      })
      .then(
        response => {
          dispatch(requestInstancesSuccess(response))
        })
      .catch(
        (error) => {
          dispatch(displayNotification({type: 'error', message: 'Cannot get instances', timeout: 5000}))
          dispatch(requestInstancesFail(error))
        })
  }
}

export function patchInstance (token, id, attributes) {
  let url = `${apiUrl}/license-manager/instance/` + id

  return (dispatch) => {
    dispatch(updateInstance())

    return axios.patch(
      url,
      {
        'data': {
          'type': 'instance',
          'id': id,
          'attributes': attributes
        }
      },
      {
        headers: {
          'centreon-imp-token': token
        }
      }
    )
      .then(
        response => {
          dispatch(updateInstanceSuccess(response))
          dispatch(resetAction())
          dispatch(displayNotification({message: 'Instance has been updated'}))
        }
      )
      .catch(
        error => {
          dispatch(displayNotification({type: 'error', message: 'Cannot update instance', timeout: 5000}))
          dispatch(updateInstanceFail(error))
        }
      )
  }
}

export function getPluginPacks (pagination, filters, token) {
  let url = `${apiUrl}/pluginpack/pluginpack`
  url += pagination

  if (filters) {
    url += '&' + filters
  }

  return (dispatch) => {
    dispatch(requestPluginPacks())

    return axios.get(
      url,
      {
        headers: {
          'centreon-imp-token': token
        }
      })
      .then(
        response => {
          dispatch(requestPluginPacksSuccess(response))
        })
      .catch(
        (error) => {
          dispatch(displayNotification({type: 'error', message: 'Cannot get plugin packs', timeout: 5000}))
          dispatch(requestPluginPacksFail(error))
        })
  }
}

export function patchPluginPack (token, id, catalogLevel) {
  let url = `${apiUrl}/pluginpack/pluginpack/` + id + `/catalog`

  return (dispatch) => {
    return axios.patch(
      url,
      {
        'data': {
          'type': 'pluginpack',
          'id': id,
          'attributes': {
            'catalog_level': catalogLevel
          }
        }
      },
      {
        headers: {
          'centreon-imp-token': token
        }
      })
      .then(
        response => {
          dispatch(displayNotification({message: 'Plugin pack catalog has been updated'}))
          dispatch(patchPluginPackSuccess(response))
        }
      )
      .catch(
        () => {
          dispatch(displayNotification({
            type: 'error',
            message: 'Cannot update catalog of the plugin pack',
            timeout: 5000
          }))
        }
      )
  }
}

export function patchPluginPackReleased (token, id, version) {
  const url = `${apiUrl}/pluginpack/pluginpack/` + id + `/version/` + version

  return (dispatch) => {
    dispatch(releasePluginPack())

    return axios.patch(
      url,
      {
        'data': {
          'type': 'pluginpack',
          'id': id,
          'attributes': {
            'released': 1
          }
        }
      },
      {
        headers: {
          'centreon-imp-token': token
        }
      })
      .then(
        response => {
          dispatch(displayNotification({message: 'Plugin pack has been released'}))
          dispatch(releasePluginPackSuccess(response))
        }
      )
      .catch(
        () => {
          dispatch(displayNotification({
            type: 'error',
            message: 'Cannot release plugin pack',
            timeout: 5000
          }))
        }
      )
  }
}

export function getPluginPacksStatistics (token, search) {
  let url = `${apiUrl}/pluginpack/pluginpack/stats`

  if (search) {
    url += '?filter[slug]=' + search
  }

  return (dispatch) => {
    dispatch(requestPluginPacksStatistics())

    return axios.get(
      url,
      {
        headers: {
          'centreon-imp-token': token
        }
      })
      .then(
        ({ data }) => {
          dispatch(requestPluginPacksStatisticsSuccess(data))
        })
      .catch(
        () => {
          dispatch(displayNotification({type: 'error', message: 'Cannot get plugin packs statistics', timeout: 5000}))
          dispatch(requestPluginPacksStatisticsFail())
        })
  }
}

export function getPluginPackStatistics (token, slug) {
  let url = `${apiUrl}/pluginpack/pluginpack/${slug}/stats`

  return (dispatch) => {
    dispatch(requestPluginPackStatistics())

    return axios.get(
      url,
      {
        headers: {
          'centreon-imp-token': token
        }
      })
      .then(
        ({ data }) => {
          dispatch(requestPluginPackStatisticsSuccess(slug, data))
        })
      .catch(
        () => {
          dispatch(displayNotification({type: 'error', message: 'Cannot get plugin pack statistics', timeout: 5000}))
          dispatch(requestPluginPackStatisticsFail())
        })
  }
}