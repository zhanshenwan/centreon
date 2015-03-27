<div class="first-content">
    <div class="btn-group custom-view-actions">
        <select id="dashboardSelector" name="aa">
            <option value="none">Select Dashboard</option>
        </select>
        <button type="button" class="btn btn-default btn-sm" id="dashboard_add">
            <span class="fa fa-plus"> {t}New{/t}</span>
        </button>
        <button type="button" class="btn btn-default btn-sm" id="dashboard_settings">
            <span class="fa fa-gears"> {t}Settings{/t}</span>
        </button>
        <button type="button" class="btn btn-default btn-sm" id="dashboard_delete">
            <span class="fa fa-trash-o"> {t}Delete{/t}</span>
        </button>
        <button type="button" class="btn btn-default btn-sm" id="dashboard_default">
            <span class="fa fa-star"> {t}Set default{/t}</span>
        </button>
        <button type="button" class="btn btn-default btn-sm" id="dashboard_bookmark">
            <span class="fa fa-tag"> {t}Bookmark{/t}</span>
        </button>
        <button type="button" class="btn btn-default btn-sm" id="dashboard_widget">
            <span class="fa fa-plus"> {t}Add widget{/t}</span>
        </button>
        <button type="button" class="btn btn-default btn-sm" id="dashboard_rotation">
            <span class="fa fa-play"> {t}Rotation{/t}</span>
        </button>
        <button type="button" class="btn btn-default btn-sm" id="dashboard_filters">
            <span class="fa fa-search"> {t}Filters{/t}</span>
        </button>
        <button type="button" class="btn btn-default btn-sm" id="dashboard_save">
            <span class="fa fa-save"> {t}Save{/t}</span>
        </button>
    </div>
</div>
<div id="dashboardBody"></div>
<div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="wizard" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
    </div>
  </div>
</div>