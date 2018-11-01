import React, { Component } from "react";
import UiButton from "../../components/uiButton";
import WidgetPortlet from "../../components/widgetPortlet";
import axios from '../../axios';

class CustomViewsRoute extends Component {

    tabsApi = axios('internal.php?object=centreon_home_customview&action=listViewsWithWidgets')

    rotationInterval = null;

    state = {
        views: null,
        actionBarToggled: false,
        currentViewIdx: null
    }

    activateTab = (viewId,currentViewIdx) => {
        let { views } = this.state;
        views.current = viewId;
        this.setState({
            views,
            currentViewIdx
        })
    }

    nextView = () => {
        const { currentViewIdx, views } = this.state;
        let nextIdx = currentViewIdx + 1
        if(nextIdx >= views.tabs.length){
            this.activateTab(views.tabs[0].custom_view_id,0);
        }else{
            this.activateTab(views.tabs[nextIdx].custom_view_id,nextIdx);
        }
    }

    setRotation = () => {
        const { views } = this.state;
        const {rotationTimer} = views;
        if(parseInt(rotationTimer) > 0){
            this.rotationInterval = setInterval(this.nextView, parseInt(rotationTimer*1000))
        }
    }

    getIndexFromViewId = (views) => {
        for(let i = 0; i < views.tabs.length; i++){
            if(views.current == views.tabs[i].custom_view_id){
                return i;
            }
        }
    }

    componentWillMount = () => {
        this.tabsApi.get().then(response => {
            let views = response.data;
            this.setState({ views, currentViewIdx: this.getIndexFromViewId(views) }, this.setRotation);
        })
    }

    componentWillUnmount = () => {
        clearInterval(this.rotationInterval);
    }

    toggleActionBar = () => {
        const { actionBarToggled } = this.state;
        this.setState({
            actionBarToggled: !actionBarToggled
        })
    }

    render() {
        const { views, actionBarToggled } = this.state;
        if (!views) {
            return null;
        }
        const { tabs } = views;
        if (!tabs) {
            return null;
        }
        return (
            <section class="main section-expand" style={{ paddingTop: '4px', position: 'relative' }}>
                <div class="pathway">
                    <a href="main.php?p=1" class="pathWay">Home</a>
                    <span class="pathWayBracket">  &nbsp;&gt;&nbsp; </span><a href="main.php?p=103" class="pathWay">Custom Views</a>
                </div>
                <div id="globalView">
                    <div class="toggleEdit" style={{cursor:'pointer'}} onClick={this.toggleActionBar.bind(this)}>
                        <a title="Show/Hide edit mode"><img src={`./img/icons/${actionBarToggled ? 'no_' : ''}edit_mode.png`} class="ico-14" /></a>
                    </div>
                    <div id="actionBar" style={{ display: (actionBarToggled ? 'block' : 'none') }}>
                        <UiButton icon={'icon-plus'} colorClass={'bt_success'} label={'Add view'} onClick={() => { }} />
                        <UiButton icon={'icon-gear'} colorClass={'bt_info'} label={'Edit view'} onClick={() => { }} />
                        <UiButton icon={'icon-trash'} colorClass={'bt_danger'} label={'Delete view'} onClick={() => { }} />
                        <UiButton icon={'icon-arrowreturnthick-1-w'} colorClass={'bt_default'} label={'Set default'} onClick={() => { }} />
                        <UiButton icon={'icon-folder-open'} colorClass={'bt_info'} label={'Share view'} onClick={() => { }} />
                        <UiButton icon={'icon-plus'} colorClass={'bt_success'} label={'Add widget'} onClick={() => { }} />
                        <UiButton icon={'icon-play'} colorClass={'bt_info'} label={'Rotation'} onClick={() => { }} />
                    </div>
                    <div id="tabs" class="ui-tabs ui-corner-all ui-widget ui-widget-content">
                        <ul class="tabs_header ui-tabs-nav ui-corner-all ui-helper-reset ui-helper-clearfix ui-widget-header" role="tablist">
                            {
                                tabs.map(tab => (
                                    <li style={{cursor:'pointer'}} onClick={this.activateTab.bind(this, tab.custom_view_id)} class={`ui-tabs-tab ui-corner-top ui-state-default ui-tab ${tab.custom_view_id == views.current ? 'ui-tabs-active ui-state-active' : ''}`}>
                                        <a class="ui-tabs-anchor">{tab.name}</a>
                                    </li>
                                ))
                            }
                        </ul>
                        {
                            tabs.map(tab => (
                                <div style={{ overflow: 'hidden', display: (tab.custom_view_id == views.current ? 'block' : 'none') }} class="ui-tabs-panel ui-corner-bottom ui-widget-content">
                                    <div class="viewBody">
                                        <div class="widgetBody column_1 ui-sortable">
                                            {
                                                tab.widgets.map(
                                                    ({ url, title, widget_id }) => (
                                                        <WidgetPortlet title={title} url={url} widgetId={widget_id} viewId={tab.custom_view_id} />
                                                    )
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                            )
                        }
                    </div>
                </div>
            </section>
        );
    }
}

export default CustomViewsRoute;
