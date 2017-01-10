<?php
/*
 * Copyright 2005-2015 Centreon
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
 * As a special exception, the copyright holders of this program give Centreon
 * permission to link this program with independent modules to produce an executable,
 * regardless of the license terms of these independent modules, and to copy and
 * distribute the resulting executable under terms of Centreon choice, provided that
 * Centreon also meet, for each linked independent module, the terms  and conditions
 * of the license of that module. An independent module is a module which is not
 * derived from this program. If you modify this program, you may extend this
 * exception to your version of the program, but you are not obliged to do so. If you
 * do not wish to do so, delete this exception statement from your version.
 *
 * For more information : contact@centreon.com
 *
 */

if (!isset($centreon)) {
    exit();
}

isset($_GET["server_id"]) ? $cG = $_GET["server_id"] : $cG = null;
isset($_POST["server_id"]) ? $cP = $_POST["server_id"] : $cP = null;
$cG ? $server_id = $cG : $server_id = $cP;

isset($_GET["select"]) ? $cG = $_GET["select"] : $cG = null;
isset($_POST["select"]) ? $cP = $_POST["select"] : $cP = null;
$cG ? $select = $cG : $select = $cP;

isset($_GET["dupNbr"]) ? $cG = $_GET["dupNbr"] : $cG = null;
isset($_POST["dupNbr"]) ? $cP = $_POST["dupNbr"] : $cP = null;
$cG ? $dupNbr = $cG : $dupNbr = $cP;

// Pear library
require_once "HTML/QuickForm.php";
require_once 'HTML/QuickForm/advmultiselect.php';
require_once 'HTML/QuickForm/Renderer/ArraySmarty.php';
    
require_once _CENTREON_PATH_."/www/include/configuration/common-Func.php";

// Path to the configuration dir
$path = "./include/configuration/configServers/";
    
// PHP functions
require_once $path."DB-Func.php";
require_once "./include/common/common-Func.php";
    
        /* Set the real page */
if ($ret['topology_page'] != "" && $p != $ret['topology_page']) {
    $p = $ret['topology_page'];
}

$serverResult = $centreon->user->access->getPollerAclConf(array('fields' => array('id', 'name', 'last_restart'),
                                                             'order'  => array('name'),
                                                             'keys'   => array('id')));

$instanceObj = new CentreonInstance($pearDB);

switch ($o) {
    case "a":
        require_once($path."formServers.php");
        break; // Add Servers
    case "w":
        require_once($path."formServers.php");
        break; // Watch Servers
    case "c":
        require_once($path."formServers.php");
        break; // Modify Servers
    case "s":
        enableServerInDB($server_id);
        require_once($path."listServers.php");
        break; // Activate a Server
    case "u":
        disableServerInDB($server_id);
        require_once($path."listServers.php");
        break; // Desactivate a Server
    case "i":
        require_once($path."getServersVersions.php");
        break; // Search for version of engines Servers
    case "m":
        multipleServerInDB(isset($select) ? $select : array(), $dupNbr);
        require_once($path."listServers.php");
        break; // Duplicate n Servers
    case "d":
        deleteServerInDB(isset($select) ? $select : array());
        require_once($path."listServers.php");
        break; // Delete n Servers
    default:
        require_once($path."listServers.php");
        break;
}