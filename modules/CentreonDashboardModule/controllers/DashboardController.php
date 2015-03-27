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
namespace CentreonDashboard\Controllers;

use Centreon\Internal\Controller;
use CentreonDashboard\Internal\Dashboard;
use CentreonDashboard\Internal\DashboardContainer;
use Centreon\Internal\Form\Generator\Web\Wizard;
use Centreon\Internal\Di;

/**
 * Description of DashboardController
 *
 * @author lionel
 */
class DashboardController extends Controller
{
    /**
     *
     * @var string 
     */
    public static $moduleName = 'CentreonDashboard';
    
    /**
     * 
     * @method get
     * @route /[i:dashboard]?
     */
    public function mainDashboardAction()
    {
        $params = $this->getParams();
        $this->tpl->addCss('block.css', 'centreon-dashboard')
                    ->addCss('select2.css')
                    ->addCss('select2-bootstrap.css');
        $this->tpl->addJs('centreon-dashboard.js', 'bottom', 'centreon-dashboard')
                    ->addJs('jquery.select2/select2.min.js', 'bottom')
                    ->addJs('centreon-wizard.js', 'bottom');
        $this->tpl->assign('baseUrl', Di::getDefault()->get('config')->get('global', 'base_url'));
        
        $currentDashboard = 0;
        if (isset($params['dashboard'])) {
            $currentDashboard = $params['dashboard'];
        }
        
        $this->tpl->assign('currentDashboard', $currentDashboard);
        $this->display('mainDashboard.tpl');
    }
    
    /**
     * 
     * @method get
     * @route /container/[a:container]/[i:dashboard]?
     */
    public function getContainerAction()
    {
        $params = $this->getParams();
        $container = DashboardContainer::getContainerByName($params['container']);
        $container->loadDashboards();
        
        $dashboardList = $container->getDashboardList(true);
        if (isset($params['dashboard'])) {
            $currentDashboard = $params['dashboard'];
        } else {
            if (count($dashboardList) > 0) {
            $currentDashboard = $dashboardList[0]['id'];
            } else {
                $currentDashboard = 0;
            }
        }
        
        $containerParams = array(
            'template' => $container->render(),
            'dashboardList' => $dashboardList,
            'currentDashboard' => $currentDashboard
        );
        
        $this->router->response()->json($containerParams);
        
    }


    /**
     * 
     * @method get
     * @route /dashboard/[i:id]
     */
    public function displayDashboardAction()
    {
        $params = $this->getParams('named');
        
        if (is_null($params['id'])) {
            $params['id'] = 1;
        }
        
        $myDashboard = new Dashboard($params['id'], false);
        echo $myDashboard->render();
        /*$this->tpl->addJs('centreon-dashboard.js', 'bottom', 'centreon-dashboard');
        
        $this->display('dashboardPanel.tpl');*/
    }
    
    /**
     * 
     */
    public function displayWidgetSelectionAction()
    {
        
    }
    
    /**
     * 
     * @method get
     * @route /dashboard/updatedashboard
     */
    public function getDashboardWizardAction()
    {
        $myWizard = new Wizard('/centreon-dashboard/dashboard/updatedashboard');
        $myWizard->getFormFromDatabase();
        echo $myWizard->generate();
    }
}
