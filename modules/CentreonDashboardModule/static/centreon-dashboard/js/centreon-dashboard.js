/*
 * Copyright 2005-2015 CENTREON
 * Centreon is developped by : Julien Mathis and Romain Le Merlus under
 * GPL Licence 2.0.
 * 
 * This program is free software; you can redistribute it and/or modify it under 
 * the terms of the GNU General Public License as published by the Free Software 
 * Foundation ; either version 2 of the License.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A 
 * PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License along with 
 * this program; if not, see <http://www.gnu.org/licenses>.
 * 
 * Linking this program statically or dynamically with other modules is making a 
 * combined work based on this program. Thus, the terms and conditions of the GNU 
 * General Public License cover the whole combination.
 * 
 * As a special exception, the copyright holders of this program give CENTREON 
 * permission to link this program with independent modules to produce an executable, 
 * regardless of the license terms of these independent modules, and to copy and 
 * distribute the resulting executable under terms of CENTREON choice, provided that 
 * CENTREON also meet, for each linked independent module, the terms  and conditions 
 * of the license of that module. An independent module is a module which is not 
 * derived from this program. If you modify this program, you may extend this 
 * exception to your version of the program, but you are not obliged to do so. If you
 * do not wish to do so, delete this exception statement from your version.
 * 
 * For more information : contact@centreon.com
 * 
 */
(function($){
    
    $.fn.centreonDashboard = function(options) {
        
        var $dashboardContainer = $(this);
        
        // Define defaults settings for the dashboard
        var settings = $.extend({
            mode: "full",
            currentDashboard: 0
        }, options );
        
        // Get Dashboard Container
        $.ajax({
            url: encodeURI(settings.baseUrl + '/centreon-dashboard/container/' + options.container)
        }).done(function(data) {
            loadContainer(this, settings, $dashboardContainer, data);
        });
        
        return this;
    };
    
    function loadContainer(obj, settings, dashboardContainer, data) {
        dashboardContainer.html(data.template);
        
        $('#dashboard_add').on('click', function(event) {
            console.log('detected');
            $('#modal').removeData('bs.modal');
            $('#modal').removeData('centreonWizard');
            $('#modal .modal-content').text('');
            $('#modal').one('loaded.bs.modal', function(e) {
                $(this).centreonWizard();
            });
            $('#modal').modal({
                remote: encodeURI(settings.baseUrl + '/centreon-dashboard/dashboard/updatedashboard')
            });
        });
        
        $('#dashboard_settings').on('click', function(event) {
            console.log('Display Dashboard Settings');
        });
        
        $('#dashboard_delete').on('click', function(event) {
            console.log('Delete Dashboard');
        });
        
        $('#dashboard_default').on('click', function(event) {
            console.log('Set Dashboard As Default');
        });
        
        $('#dashboard_default').on('click', function(event) {
            console.log('Set Dashboard As Default');
        });
        
        buildDashboardSelector(obj, settings, data.dashboardList);
        
        var currentDashboard;
        if (settings.currentDashboard > 0) {
            currentDashboard = settings.currentDashboard;
        } else if (data.currentDashboard > 0) {
            currentDashboard = data.currentDashboard;
        }
        loadDashboard(obj, settings, currentDashboard);
    };
    
    function loadDashboard(obj, settings, dashboardId) {
        var $dashboardBody = $('#dashboardBody');
        $dashboardBody.empty();
        
        // Get Dashboard
        $.ajax({
            url: encodeURI(settings.baseUrl + '/centreon-dashboard/dashboard/' + dashboardId)
        }).done(function(data) {
            $dashboardBody.html(data);
        });
    };
    
    function buildDashboardSelector(obj, settings, dashboardList) {
        var $dashboardSelector = $('#dashboardSelector');
        $.each(dashboardList, function(key, value) {
            $dashboardSelector.append('<option value="'+ value.id +'">' + value.name + '</option>');
        });
    };
        
}(jQuery));