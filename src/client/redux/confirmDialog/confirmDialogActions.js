export const OPEN_CONFIRM_DIALOG = 'OPEN_CONFIRM_DIALOG'
export const RESET_ACTION = 'RESET_ACTION'
export const CONFIRM_ACTION = 'CONFIRM_ACTION'

export function openConfirmDialog (slug, content) {
  return {
    type: OPEN_CONFIRM_DIALOG,
    slug: slug,
    content: content,
  }
}

export function resetAction () {
  return {
    type: RESET_ACTION
  }
}

export function confirmAction (slug) {
  return {
    type: CONFIRM_ACTION,
    slug: slug
  }
}