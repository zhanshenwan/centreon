import {
  CLEAN_HEADER,
  REPLACE_ENTRIES,
  REPLACE_TITLE
} from 'Redux/header/headerActions'

export default function headerReducer (
  state = {
    title: '',
    entries: {}
  },
  action
) {

  switch (action.type) {
    case CLEAN_HEADER:
      return {
        ...state,
        title: '',
        entries: {}
      }
    case REPLACE_ENTRIES:
      return {
        ...state,
        entries: action.entries
      }
    case REPLACE_TITLE:
      return {
        ...state,
        title: action.title
      }
    default:
      return state
  }
}