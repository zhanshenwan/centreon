import {
  REQUEST_INSTANCES,
  REQUEST_INSTANCES_SUCCESS,
  REQUEST_INSTANCES_FAIL,
  UPDATE_INSTANCE,
  UPDATE_INSTANCE_SUCCESS,
  UPDATE_INSTANCE_FAIL,
} from 'Redux/instance/instanceActions'


export default function instanceReducer (
  state = {
    items: [],
    openConfirmDialog: false
  },
  action
) {

  switch (action.type) {

    case REQUEST_INSTANCES:
      return {
        ...state
      }

    case REQUEST_INSTANCES_SUCCESS:
      const item = action.data.data
      const meta = action.data.meta

      const rows = item.reduce((acc, result) => {

        const attributes = result.attributes
        const instanceId = result.id

        acc[instanceId] = {
          companyName: attributes.company.name,
          fingerprint: attributes.fingerprint,
          serverName: attributes.name,
          subscriptionState: {
            instanceId : result.id,
            slug : 'instance-unlink-' + result.id,
            state: attributes.subscription.active
          },
          unlimitedAccess: {
            instanceId: result.id,
            slug: 'instance-unlimited-' + result.id,
            serverName: attributes.name,
            unlimitedMode : attributes.viewNotReleased,
          },
        }

        return acc

      }, {})

      return {
        ...state,
        items: rows,
        totalPages: meta['total-pages'],
        totalItems: meta.totalItems
      }
    case REQUEST_INSTANCES_FAIL:
      return {
        ...state,
        error: action.err,
      }
    case UPDATE_INSTANCE:
      return {
        ...state,
      }
    case UPDATE_INSTANCE_SUCCESS:
      let { items } = state
      const instance = action.instance

      return {
        ...state,
        items : {
          ...state.items,
          [instance.id]: {
            ...items[instance.id],
            unlimitedAccess: {
              ...items[instance.id].unlimitedAccess,
              unlimitedMode: instance.attributes.viewNotReleased,
            },
            subscriptionState: {
              ...items[instance.id].subscriptionState,
              state: instance.attributes.subscription.active,
            },
          },
        },
      }
    case UPDATE_INSTANCE_FAIL:
      return {
        ...state
      }
    default:
      return state
  }
}