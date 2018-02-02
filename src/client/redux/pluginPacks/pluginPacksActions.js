import { patchPluginPack } from 'Services/hubApi'

export const REQUEST_PLUGIN_PACKS = 'REQUEST_PLUGIN_PACKS'
export const REQUEST_PLUGIN_PACKS_SUCCESS = 'REQUEST_PLUGIN_PACKS_SUCCESS'
export const REQUEST_PLUGIN_PACKS_FAIL = 'REQUEST_PLUGIN_PACKS_FAIL'

export const OPEN_CATALOG_FORM_POPIN = 'OPEN_CATALOG_FORM_POPIN'
export const CLOSE_CATALOG_FORM_POPIN = 'CLOSE_CATALOG_FORM_POPIN'

export const PATCH_PLUGIN_PACK_SUCCESS = 'PATCH_PLUGIN_PACK_SUCCESS'

export const RELEASE_PLUGIN_PACK = 'RELEASE_PLUGIN_PACK'
export const RELEASE_PLUGIN_PACK_SUCCESS = 'RELEASE_PLUGIN_PACK_SUCCESS'

export function requestPluginPacks () {
  return {
    type: REQUEST_PLUGIN_PACKS,
  }
}

export function requestPluginPacksSuccess (result) {
  return {
    type: REQUEST_PLUGIN_PACKS_SUCCESS,
    result
  }
}

export function requestPluginPacksFail (err) {
  return {
    type: REQUEST_PLUGIN_PACKS_FAIL,
    error: err,
  }
}

export function openCatalogFormPopin (pluginPackId, level) {
  return {
    type: OPEN_CATALOG_FORM_POPIN,
    catalogFormPopin: {
      open: true,
      id: pluginPackId,
      level: (level !== null) ? level.toString() : null
    }
  }
}

export function closeCatalogFormPopin () {
  return {
    type: CLOSE_CATALOG_FORM_POPIN,
    catalogFormPopin: {
      open: false,
    }
  }
}

export function patchPluginPackSuccess (response) {
  return {
    type: PATCH_PLUGIN_PACK_SUCCESS,
    catalogFormPopin: {
      open: false,
    },
    item: response.data.data
  }
}

export const releasePluginPack = () => {
  return {
    type: RELEASE_PLUGIN_PACK
  }
}

export const releasePluginPackSuccess = (response) => {
  return {
    type: RELEASE_PLUGIN_PACK_SUCCESS,
    item: response.data.data
  }
}
