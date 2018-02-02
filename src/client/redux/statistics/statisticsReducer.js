import {
  REQUEST_PLUGIN_PACKS_STATISTICS,
  REQUEST_PLUGIN_PACKS_STATISTICS_SUCCESS,
  REQUEST_PLUGIN_PACKS_STATISTICS_FAIL,
  REQUEST_PLUGIN_PACK_STATISTICS,
  REQUEST_PLUGIN_PACK_STATISTICS_SUCCESS,
  REQUEST_PLUGIN_PACK_STATISTICS_FAIL,
} from 'Redux/statistics/statisticsActions'


export default function statisticsReducer (
  state = {
    loading: false,
    slug: null,
    pluginPacks: {}
  },
  action
) {
  let updatedState

  switch (action.type) {
    case REQUEST_PLUGIN_PACKS_STATISTICS:
    case REQUEST_PLUGIN_PACK_STATISTICS:
      return {
        ...state,
        loading: true
      }
    case REQUEST_PLUGIN_PACKS_STATISTICS_SUCCESS:
      updatedState = {
        ...state,
        pluginPacks: {},
        loading: false,
        slug: null
      }
      for (const pluginPack of action.data) {
        updatedState = {
          ...updatedState,
          pluginPacks: {
            ...updatedState.pluginPacks,
            [pluginPack.attributes.slug]: {
              ...updatedState.pluginPacks[pluginPack.attributes.slug],
              ...pluginPack.attributes
            }
          }
        }
      }
      return updatedState
    case REQUEST_PLUGIN_PACK_STATISTICS_SUCCESS:
      updatedState = {
        ...state,
        loading: false,
        slug: action.slug
      }
      for (const version of action.data) {
        updatedState = {
          ...updatedState,
          pluginPacks: {
            ...updatedState.pluginPacks,
            [action.slug]: {
              ...updatedState.pluginPacks[action.slug],
              versions: {
                ...updatedState.pluginPacks[action.slug].versions,
                [version.attributes.version]: {
                  totalInstalled: version.attributes.totalInstalled,
                  totalUpdated: version.attributes.totalUpdated
                }
              }
            }
          }
        }
      }
      return updatedState
    case REQUEST_PLUGIN_PACKS_STATISTICS_FAIL:
    case REQUEST_PLUGIN_PACK_STATISTICS_FAIL:
      return {
        ...state,
        loading: false
      }
    default:
      return state
  }
}