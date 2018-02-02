import {
  REQUEST_PLUGIN_PACKS,
  REQUEST_PLUGIN_PACKS_SUCCESS,
  REQUEST_PLUGIN_PACKS_FAIL,
  OPEN_CATALOG_FORM_POPIN,
  CLOSE_CATALOG_FORM_POPIN,
  PATCH_PLUGIN_PACK_SUCCESS,
  RELEASE_PLUGIN_PACK_SUCCESS
} from 'Redux/pluginPacks/pluginPacksActions'

export default function pluginPacksReducer (
  state = {
    items: {},
    catalogFormPopin: {
      open: false,
      id: null,
      level: null
    }
  },
  action
) {

  switch (action.type) {
    case REQUEST_PLUGIN_PACKS:
      return {
        ...state
      }
    case REQUEST_PLUGIN_PACKS_SUCCESS:
      const pluginPacks = action.result.data.data.reduce((acc, currentValue, index) => {
        const attributes = currentValue.attributes

        acc[currentValue.id] = {
          order: index,
          id: currentValue.id,
          slug: attributes.slug,
          name: attributes.name,
          version: attributes.version,
          catalog_level: attributes.catalog ? attributes.catalog.level : null,
          released: attributes.released
        }
        return acc
      }, {})

      return {
        ...state,
        items: pluginPacks,
        totalPages: action.result.data.meta['total-pages'],
        totalItems: action.result.data.meta['totalItems']
      }
    case REQUEST_PLUGIN_PACKS_FAIL:
      return {
        ...state,
        error: action.err,
      }
    case OPEN_CATALOG_FORM_POPIN:
      return {
        ...state,
        catalogFormPopin: action.catalogFormPopin
      }
    case CLOSE_CATALOG_FORM_POPIN:
      return {
        ...state,
        catalogFormPopin: {
          ...state.catalogFormPopin,
          open: action.open
        }
      }
    case PATCH_PLUGIN_PACK_SUCCESS:
      return {
        ...state,
        items: {
          ...state.items,
          [action.item.id]: {
            ...state.items[action.item.id],
            catalog_level: action.item.attributes.catalog.level
          }
        }
      }
    case RELEASE_PLUGIN_PACK_SUCCESS:
      return {
        ...state,
        items: {
          ...state.items,
          [action.item.id]: {
            ...state.items[action.item.id],
            released: true
          }
        }
      }
    default:
      return state
  }

}