import { createStore, applyMiddleware, compose } from "redux";
import { routerMiddleware } from "react-router-redux";
import reducers from "../redux/reducers";
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';

export const history = createHistory({
  basename: '/monitoring'
});

const createAppStore = (options, initialState = {}) => {
  const middlewares = [
    routerMiddleware(history),
    thunk,
  ];

  const store = createStore(
    reducers,
    initialState,
    compose(
      applyMiddleware(...middlewares),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );

  return store;
};

export default createAppStore;
