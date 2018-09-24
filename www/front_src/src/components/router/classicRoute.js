import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, withRouter } from "react-router-dom";

class ClassicRoute extends Component {
  getRoute = renderProps => {
    const { component: Comp } = this.props;
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
    const { component, path, ...rest } = this.props;

    return (
      <Route
        {...rest}
        path={this.props.location.pathname + path}
        render={renderProps => this.getRoute(renderProps)}
      />
    );
  }
}

export default withRouter(ClassicRoute);
