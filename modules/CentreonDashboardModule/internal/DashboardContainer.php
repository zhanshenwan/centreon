<?php

/*
 * Copyright 2005-2014 CENTREON
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

namespace CentreonDashboard\Internal;

use CentreonDashboard\Models\Dashboard as DashboardModel;
use CentreonDashboard\Models\Dashboardcontainer as DashboardContainerModel;
use Centreon\Internal\Template;

/**
 * Description of DashboardContainer
 *
 * @author lionel
 */
class DashboardContainer
{
    /**
     *
     * @var type 
     */
    private $id;
    
    /**
     *
     * @var type 
     */
    private $name;
    
    /**
     *
     * @var type 
     */
    private $mode;
    
    /**
     *
     * @var type 
     */
    private $dashboards;
    
    /**
     * 
     * @param type $id
     * @param type $name
     * @param type $mode
     */
    public function __construct($id, $name, $mode = 'full')
    {
        $this->id = $id;
        $this->name = $name;
        $this->mode = $mode;
        $this->dashboards = array();
    }
    
    /**
     * 
     */
    public function loadDashboards()
    {
        $dashboardList = DashboardModel::getList('dashboard_id', -1, 0, null, 'ASC', array('container_id' => $this->id));
        foreach ($dashboardList as $dashboard) {
            $this->dashboards[] = new Dashboard($dashboard['dashboard_id'], false);
        }
    }
    
    /**
     * 
     * @param boolean $onlyName
     */
    public function getDashboardList($onlyName = false)
    {
        $finalList = array();
        if ($onlyName) {
            foreach ($this->dashboards as $myDashboard) {
                $finalList[] = array(
                    'id' => $myDashboard->getId(),
                    'name' => $myDashboard->getName()
                );
            }
        } else {
            $finalList = $this->dashboards;
        }
        
        return $finalList;
    }
    
    /**
     * 
     * @return type
     */
    public function render()
    {
        $origin = 'file:[CentreonDashboardModule]';
        if ($this->mode == 'light') {
            $origin .= 'container-light.tpl/';
        } elseif ($this->mode == 'full') {
            $origin .= 'container-full.tpl/';
        }
        $containerTpl = new Template($origin);
        
        return $containerTpl->fetch($origin);
    }
    
    /**
     * 
     * @param string $containerName
     * @return \CentreonDashboard\Internal\DashboardContainer
     */
    public static function getContainerByName($containerName)
    {
        $id = DashboardContainerModel::getIdByParameter('name', $containerName);
        return self::getContainerById($id[0]);
    }
    
    /**
     * 
     * @param integer $id
     * @return \CentreonDashboard\Internal\DashboardContainer
     */
    public static function getContainerById($id)
    {
        $containerDatas = DashboardContainerModel::get($id);
        return new DashboardContainer($id, $containerDatas['name'], $containerDatas['mode']);
    }
}
