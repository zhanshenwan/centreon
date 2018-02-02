import {
  OPEN_CONFIRM_DIALOG,
  RESET_ACTION,
  CONFIRM_ACTION,
  CLEAN_CONFIRM_DIALOG
} from 'Redux/confirmDialog/confirmDialogActions'


export default function confirmDialogReducer (
  state = {
    slug: null,
    allowAction: false,
    open: false,
    content: {
      body: '',
      cancel: '',
      confirm: '',
    }
  },
  action
) {
  switch (action.type) {
    case OPEN_CONFIRM_DIALOG:
      return {
        ...state,
        open: true,
        allowAction: false,
        slug: action.slug,
        content: action.content,
      }
    case RESET_ACTION:
      return {
        ...state,
        open: false,
        allowAction: false,
        slug: null,
        content: {
          body: '',
          cancel: '',
          confirm: '',
        }
      }
    case CONFIRM_ACTION:
      return {
        ...state,
        open: false,
        allowAction: true,
        slug: action.slug,
        content: {
          body: '',
          cancel: '',
          confirm: '',
        },
      }
    default:
      return state
  }
}