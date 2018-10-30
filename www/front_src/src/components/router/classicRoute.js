import React, { Component } from "react";
import { Route } from "react-router-dom";

class ClassicRoute extends Component {
  getRoute = renderProps => {
    const { component: Comp } = this.props;
    console.log(renderProps.match)

    return (
      <Comp
        key={
          renderProps.match.params.id
            ? renderProps.match.params.id
            : Math.random()
        }
        {...renderProps}
      />
    );
  };

  render() {
    const { component, ...rest } = this.props;
    console.log('toto')

    return (
      <Route {...rest} render={renderProps => this.getRoute(renderProps)} />
    );
  }
}

export default ClassicRoute;
