{extends file="file:[Core]viewLayout.tpl"}

{block name="title"}Centreon Dashboard{/block}

{block name="content"}
    <div id="mainDashboard"></div>
{/block}

{block name="javascript-bottom" append}
    <script>
        $("#mainDashboard").centreonDashboard({
            mode: 'full',
            container: 'mainDashboard',
            baseUrl: '{$baseUrl}',
            currentDashboard: '{$currentDashboard}'
        });
    </script>
{/block}