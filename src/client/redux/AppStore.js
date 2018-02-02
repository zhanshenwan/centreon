import { combineReducers , createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware, routerReducer } from 'react-router-redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { persistReducer, persistStore } from 'redux-persist'
import localForage from 'localforage'
import authReducer from 'Redux/auth/authReducer'
import notificationReducer from 'Redux/notification/notificationReducer'
import headerReducer from 'Redux/header/headerReducer'
import confirmDialogReducer from 'Redux/confirmDialog/confirmDialogReducer'
import instanceReducer from 'Redux/instance/instanceReducer'
import pluginPacksReducer from 'Redux/pluginPacks/pluginPacksReducer'
import statisticsReducer from 'Redux/statistics/statisticsReducer'

const history = createHistory()
const middleware = routerMiddleware(history)
const logger = createLogger()

const configRouter = {
  key: 'router',
  storage: localForage
}

const configAuth = {
  key: 'auth',
  storage: localForage
}

const configNotification = {
  key: 'notification',
  storage: localForage
}

const configHeader = {
  key: 'header',
  storage: localForage
}

const configInstance = {
  key: 'instance',
  storage: localForage
}

const configPluginPacks = {
  key: 'pluginpacks',
  storage: localForage
}

const configStatistics = {
  key: 'statistics',
  storage: localForage
}

let rootReducer = combineReducers({
  routerReducer: persistReducer(configRouter, routerReducer),
  authReducer: persistReducer(configAuth, authReducer),
  headerReducer: persistReducer(configHeader, headerReducer),
  notificationReducer: persistReducer(configNotification, notificationReducer),
  confirmDialogReducer: confirmDialogReducer,
  instanceReducer: persistReducer(configInstance, instanceReducer),
  pluginPacksReducer: persistReducer(configPluginPacks, pluginPacksReducer),
  statisticsReducer: persistReducer(configStatistics, statisticsReducer),
})

const store = createStore(
  rootReducer,
  {},
  composeWithDevTools(applyMiddleware(middleware, thunk, logger))
)

const persistor = persistStore(store)

export { store, persistor, history }
