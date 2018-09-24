import React, { Component } from "react";
import Header from "./components/header";
import { Switch } from "react-router-dom";
import { ConnectedRouter } from "react-router-redux";
import { history } from "./store";
import routes from "./route-maps/classicRoutes.js";
import ClassicRoute from "./components/router/classicRoute";
import NavigationComponent from "./components/navigation";
import "babel-polyfill";

class App extends Component {
  render() {
    return (
      <ConnectedRouter history={history}>
        <div class="wrapper">
          <NavigationComponent />
          <div id="content">
            <Header />
            <div class="main-content">
              <Switch onChange={this.handle}>
                {routes.map(({ comp, ...rest }) => (
                  <ClassicRoute
                    history={history}
                    component={comp}
                    {...rest}
                  />
                ))}
              </Switch>
            </div>
          </div>
        </div>
      </ConnectedRouter>
    );
  }
}

export default App;
