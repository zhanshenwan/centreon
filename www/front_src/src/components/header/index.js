import React, { Component } from "react";
import { connect } from "react-redux";

import { setRefreshIntervals } from '../../redux/actions/refreshActions';

import PollerMenu from "../pollerMenu";
import UserMenu from "../userMenu";
import HostMenu from "../hostMenu";
import ServiceStatusMenu from "../serviceStatusMenu";

import {DynamicComponentPosition, DynamicComponentLoader} from '@centreon/react-components';

import axios from '../../axios';

class TopHeader extends Component {

  state = {
    DynamicLoader:React.Fragment
  }

  refreshIntervalsApi = axios("internal.php?object=centreon_topcounter&action=refreshIntervals");
  bamCheckApi = axios("internal.php?object=centreon_modules_webservice&action=getBamModuleInfo");

  getRefreshIntervals = () => {
    const { setRefreshIntervals } = this.props;
    this.refreshIntervalsApi
      .get()
      .then(({ data }) => {
        setRefreshIntervals(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  checkIfBamExist = () => {
    this.bamCheckApi.post().then(response => {
      if(response.data){
        if(response.data.enabled){
          this.setState({
            DynamicLoader:DynamicComponentLoader
          });
        }
      }
    });
  }

  UNSAFE_componentWillMount = () => {
    this.checkIfBamExist()
    this.getRefreshIntervals()
  }

  render() {
    const {DynamicLoader} = this.state;
    return (
      <header class="header">
        <div class="header-icons">
          <div class="wrap wrap-left">
            <PollerMenu />
          </div>
          <div class="wrap wrap-right">
            <DynamicLoader componentName={'topCounter'} componentUrl={'./modules/centreon-bam-server/react/compiled-components/topCounter/index.html'}/>
            <DynamicComponentPosition componentName={'topCounter'} />
            <HostMenu />
            <ServiceStatusMenu />
            <UserMenu />
          </div>
        </div>
      </header>
    );
  };
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  setRefreshIntervals
};

export default connect(mapStateToProps, mapDispatchToProps)(TopHeader);
