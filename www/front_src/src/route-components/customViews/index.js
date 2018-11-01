import React, { Component } from "react";
import UiButton from "../../components/uiButton";
import WidgetPortlet from "../../components/widgetPortlet";
import axios from '../../axios';


class CustomViewsRoute extends Component {

    tabsApi = axios('internal.php?object=centreon_home_customview&action=listViewsWithWidgets')

    state = {
        views: null
    }

    activateTab = (viewId) => {
        let { views } = this.state;
        views.current = viewId;
        this.setState({
            views
        })
    }

    componentWillMount = () => {
        this.tabsApi.get().then(response => {
            let views = response.data;
            this.setState({ views });
        })
    }

    render() {
        const { views } = this.state;
        if (!views) {
            return null;
        }
        const { tabs } = views;
        if(!tabs){
            return null;
        }
        return (
            <section class="main section-expand" style={{ paddingTop: '4px' }}>
                <div class="pathway">
                    <a href="main.php?p=1" class="pathWay">Home</a>
                    <span class="pathWayBracket">  &nbsp;&gt;&nbsp; </span><a href="main.php?p=103" class="pathWay">Custom Views</a>
                </div>
                <div id="globalView">
                    <div class="toggleEdit">
                        <a href="#" title="Show/Hide edit mode"><img src="./img/icons/edit_mode.png" class="ico-14" /></a>
                    </div>
                    <div>
                        <UiButton icon={'icon-plus'} colorClass={'bt_success'} label={'Add view'} onClick={() => { }} />
                        <UiButton icon={'icon-gear'} colorClass={'bt_info'} label={'Edit view'} onClick={() => { }} />
                        <UiButton icon={'icon-trash'} colorClass={'bt_danger'} label={'Delete view'} onClick={() => { }} />
                        <UiButton icon={'icon-arrowreturnthick-1-w'} colorClass={'bt_default'} label={'Set default'} onClick={() => { }} />
                        <UiButton icon={'icon-folder-open'} colorClass={'bt_info'} label={'Share view'} onClick={() => { }} />
                        <UiButton icon={'icon-plus'} colorClass={'bt_success'} label={'Add widget'} onClick={() => { }} />
                        <UiButton icon={'icon-play'} colorClass={'bt_info'} label={'Rotation'} onClick={() => { }} />
                    </div>
                </div>
                <div class="ui-tabs ui-corner-all ui-widget ui-widget-content">
                    <ul class="tabs_header ui-tabs-nav ui-corner-all ui-helper-reset ui-helper-clearfix ui-widget-header" role="tablist">
                        {
                            tabs.map(tab => (
                                <li onClick={this.activateTab.bind(this, tab.custom_view_id)} class={`ui-tabs-tab ui-corner-top ui-state-default ui-tab ${tab.custom_view_id == views.current ? 'ui-tabs-active ui-state-active' : ''}`}>
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
            </section>
        );
    }
}

export default CustomViewsRoute;
