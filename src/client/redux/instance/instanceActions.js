
export const REQUEST_INSTANCES = 'REQUEST_INSTANCES'
export const REQUEST_INSTANCES_SUCCESS = 'REQUEST_INSTANCES_SUCCESS'
export const REQUEST_INSTANCES_FAIL = 'REQUEST_INSTANCES_FAIL'

export const UPDATE_INSTANCE = 'UPDATE_INSTANCE'
export const UPDATE_INSTANCE_SUCCESS = 'UPDATE_INSTANCE_SUCCESS'
export const UPDATE_INSTANCE_FAIL = 'UPDATE_INSTANCE_FAIL'

export function requestInstances () {
  return {
    type: REQUEST_INSTANCES,
  }
}

export function requestInstancesSuccess (res) {
  return {
    type: REQUEST_INSTANCES_SUCCESS,
    data: res.data,
  }
}

export function requestInstancesFail (err) {
  return {
    type: REQUEST_INSTANCES_FAIL,
    error: err,
  }
}

export function updateInstance () {
  return {
    type: UPDATE_INSTANCE,
  }
}

export function updateInstanceSuccess (res) {
  return {
    type: UPDATE_INSTANCE_SUCCESS,
    instance: {
      id: res.data.data.id,
      attributes: res.data.data.attributes,
    }
  }
}

export function updateInstanceFail (err) {
  return {
    type: UPDATE_INSTANCE_FAIL,
    error: err,
  }
}