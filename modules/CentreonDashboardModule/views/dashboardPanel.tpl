{extends file="file:[Core]viewLayout.tpl"}

{block name="title"}Centreon Dashboard{/block}

{block name="content"}
    
    <div id="mainDashboard"></div>
    
    {*<div id="dashboardToolbar">Dashboard Toolbar</div>
    <div id="widgetList">Widget List Here</div>
    <div id="blocks">{$dashboardLayout}</div>*}
{/block}

{block name="javascript-bottom"}
    <script>
        $("#mainDashboard").centreonDashboard({
            mode: 'full',
            containerId: 1
        });
    </script>
{/block}