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
use CentreonAdministration\Models\User;
use CentreonDashboard\Internal\Dashboard\Layout;
use CentreonDashboard\Internal\Dashboard\ElementCollection;
use CentreonDashboard\Internal\Dashboard\Renderer;

/**
 * Description of Dashboard
 *
 * @author lionel
 */
class Dashboard
{
    /**
     *
     * @var integer 
     */
    private $id;
    
    /**
     *
     * @var string 
     */
    private $name;
    
    /**
     *
     * @var string 
     */
    private $description;
    
    /**
     *
     * @var type 
     */
    private $user;
    
    /**
     *
     * @var type 
     */
    private $layout;
    
    /**
     *
     * @var type 
     */
    private $elements;
    
    /**
     *
     * @var type 
     */
    private $renderer;
    
    /**
     * 
     * @param type $id
     * @param type $lazy
     */
    public function __construct($id, $lazy = true)
    {
        $this->id = $id;
        $dashboardDatas = DashboardModel::get($this->id);
        $this->name = $dashboardDatas['name'];
        $this->description = $dashboardDatas['description'];
        
        if ($lazy) {
            $this->user = $dashboardDatas['user_id'];
            $this->layout = $dashboardDatas['user_id'];
        } else {
            $this->user = User::get($dashboardDatas['user_id']);
            if (!is_null($dashboardDatas['layout_id'])) {
                $this->layout = new Layout($dashboardDatas['layout_id']);
            }
        }
        
        $this->elements = new ElementCollection($id);
        
        if (!is_null($this->layout)) {
            $this->renderer = new Renderer($this->layout->getTemplate());
        }
    }
    
    /**
     * 
     */
    public function render()
    {
        return $this->renderer->renderFinal();
    }
}
