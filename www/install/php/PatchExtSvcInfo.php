<?php
/*
 * Centreon is developped with GPL Licence 2.0 :
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt
 * Developped by : Julien Mathis - Romain Le Merlus 
 * 
 * The Software is provided to you AS IS and WITH ALL FAULTS.
 * Centreon makes no representation and gives no warranty whatsoever,
 * whether express or implied, and without limitation, with regard to the quality,
 * any particular or intended purpose of the Software found on the Centreon web site.
 * In no event will Centreon be liable for any direct, indirect, punitive, special,
 * incidental or consequential damages however they may arise and even if Centreon has
 * been previously advised of the possibility of such damages.
 * 
 * For information : contact@oreon-project.org
 */
 
 $oreon = NULL;
require_once ("../../oreon.conf.php");
require_once ("../../DBconnect.php");

function delete_doublon_host($host_id = NULL)
{
	global $pearDB;
	$cmd = "DELETE FROM extended_host_information WHERE ehi_id = ".$host_id." ";
	$pearDB->query($cmd);
}

function delete_doublon_service($service_id = NULL)
{
	global $pearDB;
	$cmd = "DELETE FROM extended_service_information WHERE esi_id = ".$service_id." ";
	$pearDB->query($cmd);
}

# retrieve all service_id
$res_svc =& $pearDB->query("SELECT service_id FROM service");
$svc_ary = array();
while ($res_svc->fetchInto($service)){
	$svc_ary[$service["service_id"]] = 0;
}
$res_svc->free();
# retrieve all doublon service
$researh_cmd =& $pearDB->query("SELECT esi_id, service_service_id FROM extended_service_information");
while ($researh_cmd->fetchInto($result)){
	$svc_ary[$result["service_service_id"]] += 1;
	if ($svc_ary[$result["service_service_id"]] > 1){
		delete_doublon_service($result["esi_id"]);
	}
}
$researh_cmd->free();


# retrieve all host_id
$res_host =& $pearDB->query("SELECT host_id FROM host");
$host_ary = array();
while ($res_host->fetchInto($host)){
	$host_ary[$host["host_id"]] = 0;
}
$res_host->free();
# retrieve all doublon host
$researh_cmd2 =& $pearDB->query("SELECT ehi_id, host_host_id FROM extended_host_information");
while ($researh_cmd2->fetchInto($result2)){
	$host_ary[$result2["host_host_id"]] += 1;
	if ($host_ary[$result2["host_host_id"]] > 1){
		delete_doublon_host($result2["ehi_id"]);
	}
}
$researh_cmd2->free();

?>