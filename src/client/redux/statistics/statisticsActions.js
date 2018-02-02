
export const REQUEST_PLUGIN_PACKS_STATISTICS = 'REQUEST_PLUGIN_PACKS_STATISTICS'
export const REQUEST_PLUGIN_PACKS_STATISTICS_SUCCESS = 'REQUEST_PLUGIN_PACKS_STATISTICS_SUCCESS'
export const REQUEST_PLUGIN_PACKS_STATISTICS_FAIL = 'REQUEST_PLUGIN_PACKS_STATISTICS_FAIL'

export const REQUEST_PLUGIN_PACK_STATISTICS = 'REQUEST_PLUGIN_PACK_STATISTICS'
export const REQUEST_PLUGIN_PACK_STATISTICS_SUCCESS = 'REQUEST_PLUGIN_PACK_STATISTICS_SUCCESS'
export const REQUEST_PLUGIN_PACK_STATISTICS_FAIL = 'REQUEST_PLUGIN_PACK_STATISTICS_FAIL'


export function requestPluginPacksStatistics () {
  return {
    type: REQUEST_PLUGIN_PACKS_STATISTICS,
  }
}

export function requestPluginPacksStatisticsSuccess (response) {
  return {
    type: REQUEST_PLUGIN_PACKS_STATISTICS_SUCCESS,
    data: response.data
  }
}

export function requestPluginPacksStatisticsFail () {
  return {
    type: REQUEST_PLUGIN_PACKS_STATISTICS_FAIL,
  }
}

export function requestPluginPackStatistics () {
  return {
    type: REQUEST_PLUGIN_PACK_STATISTICS,
  }
}

export function requestPluginPackStatisticsSuccess (slug, response) {
  return {
    type: REQUEST_PLUGIN_PACK_STATISTICS_SUCCESS,
    slug: slug,
    data: response.data
  }
}

export function requestPluginPackStatisticsFail () {
  return {
    type: REQUEST_PLUGIN_PACK_STATISTICS_FAIL,
  }
}

