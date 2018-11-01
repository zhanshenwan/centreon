import React, { Component } from "react";

class WidgetPortlet extends Component {

    state = {
        minimized: false
    }

    refreshWidget = () => {
        const { viewId, widgetId } = this.props;
        let iframe = document.querySelector(`[name="widget_${widgetId}_${viewId}"]`);
        if(iframe.contentWindow){
            if(iframe.contentWindow.loadPage){
                iframe.contentWindow.loadPage();
            }
        }
    }

    togglePortletMinimization = () => {
        const { minimized } = this.state;
        this.setState({
            minimized:!minimized
        })
    }

    deletePortlet = () => {
        const deleteWdgtMessage = "Deleting this widget might impact users with whom you are sharing this view.\nAre you sure you want to do it?";
        if (window.confirm(deleteWdgtMessage)) {
          
        }
    }

    toggleEditPortlet = () => {
        const { viewId, widgetId} = this.props;
        let popin = window.jQuery('<div id="config-popin">');
        const url = `./api/internal.php?object=centreon_home_customview&resultFormat=html&action=preferences&viewId=${viewId}&widgetId=${widgetId}`;
        popin.centreonPopin({
            url: url,
            open: true,
            ajaxType: 'GET',
            ajaxDataType: 'html'
        });
    }

    render() {
        const { viewId, widgetId, title, url} = this.props;
        const { minimized } = this.state;
        const iframeUrl = `${url}?widgetId=${widgetId}&customViewId=${viewId}`;

        return (
            <div class="portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all">
                <div class="portlet-header ui-sortable-handle ui-widget-header ui-corner-all">
                    <span onClick={this.togglePortletMinimization.bind(this)} class={`show-hide ui-icon ${minimized ? 'ui-icon-plusthick' : 'ui-icon-minusthick'}`}></span>
                    <span onClick={this.deletePortlet.bind(this)} class="ui-icon ui-icon-trash"></span>
                    <span onClick={this.toggleEditPortlet.bind(this)} class="ui-icon ui-icon-wrench"></span>
                    <span onClick={this.refreshWidget.bind(this)} class="ui-icon ui-icon-refresh" ></span>
                    <span class="widgetTitle" id={`title_${widgetId}`} title="Click to edit">{title}</span>
                </div>
                <div class="portlet-content" style={{ overflow: 'hidden', display: (minimized ? 'none' : 'block') }}>
                    <iframe name={`widget_${widgetId}_${viewId}`} frameborder="0" width="100%" src={iframeUrl}></iframe>
                </div>
            </div>
        )
    }
}

export default WidgetPortlet;


