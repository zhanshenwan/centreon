export const CLEAN_HEADER = 'CLEAN_HEADER'
export const REPLACE_ENTRIES = 'REPLACE_ENTRIES'
export const REPLACE_TITLE = 'REPLACE_TITLE'

export function cleanHeader () {
  return {
    type: CLEAN_HEADER
  }
}

export function replaceEntries (entries) {
  return {
    type: REPLACE_ENTRIES,
    entries
  }
}

export function replaceTitle (title) {
  return {
    type: REPLACE_TITLE,
    title
  }
}