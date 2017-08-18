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

/*
 * this class need also others classes
 */
require_once _CENTREON_PATH_."www/class/centreonDuration.class.php";
require_once _CENTREON_PATH_."www/class/centreonGMT.class.php";
require_once _CENTREON_PATH_."www/class/centreonACL.class.php";
require_once _CENTREON_PATH_."www/class/centreonHost.class.php";
require_once _CENTREON_PATH_."www/class/centreonService.class.php";
require_once _CENTREON_PATH_."www/class/centreonSession.class.php";
require_once _CENTREON_PATH_."www/include/common/common-Func.php";

function _process_toposort($pointer, &$dependency, &$order, &$pre_processing){
    if (isset($pre_processing[$pointer])) {
        return false;
    } else { 
        $pre_processing[$pointer] = $pointer;
    }
 
    foreach($dependency[$pointer] as $i=>$v){
        if(isset($dependency[$v])){
            if(!_process_toposort($v, $dependency, $order, $pre_processing)) return false;
        }
        $order[$v] = $v;
        unset($pre_processing[$v]);
    }
    $order[$pointer] = $pointer;
    unset($pre_processing[$pointer]);
    return true;
}
 
function _topological_sort($data, $dependency){
    $order = array();
    $pre_processing = array();
    $order = array_diff_key($data, $dependency);
    $data = array_diff_key($data, $order);
    foreach($data as $i=>$v){
        if(!_process_toposort($i,$dependency,$order, $pre_processing)) return false;
    }
    return $order;
}

class CentreonGraphNg {
    /*
     * Objects
     */
    var $db;
    var $db_cs;

    /*
     * private vars
     */
    protected $_RRDoptions;
    protected $_arguments;
    protected $_options;
    protected $_colors;
    protected $_flag;
    protected $maxLimit;

    /*
     * Variables
     */
    var $debug;
    var $user_id;
    var $general_opt;
    var $dbPath;
    var $dbStatusPath;
    var $index_id;
    var $indexData;
    var $template_id;
    var $templateInformations;
    var $graphID;
    var $metricsEnabled;
    var $vname;
    var $metrics;
    var $onecurve;

    private function _initDatabase() {
        global $conf_centreon;
        
        $mysql_host = $conf_centreon["hostCentreon"];
        $mysql_database = $conf_centreon["db"];
        $mysql_user = $conf_centreon["user"];
        $mysql_password = $conf_centreon["password"];
        $mysql_port = $conf_centreon["port"] ? $conf_centreon["port"] : '3306';
        $this->db = new PDO("mysql:dbname=pdo;host=" . $mysql_host . ";port=" . $mysql_port . ";dbname=" . $mysql_database,
        $mysql_user, $mysql_password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $mysql_host_cs = $conf_centreon["hostCentstorage"];
        $mysql_database_cs = $conf_centreon["dbcstg"];
        $this->db_cs = new PDO("mysql:dbname=pdo;host=" . $mysql_host_cs . ";port=" . $mysql_port . ";dbname=" . $mysql_database_cs,
        $mysql_user, $mysql_password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
        $this->db_cs->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    public function __construct($host_id, $service_id, $user_id) {        
        $this->_initDatabase();
        
        $this->cache_all_metrics = array();
        $this->vnodes = array();
        $this->vnodes_dependencies = array();
        $this->vmetrics_order = array();
        
        $this->ds_default = null;
        $this->color_cache = null;
        $this->user_id = $user_id;
        $this->indexData = null;
        $this->components_ds_cache = null; 
        $this->listMetricsId = array();
        $this->metrics = array();
        $this->vmetrics = array();
        $this->extra_datas = array();
        $this->index_id = $this->getIndexDataId($host_id, $service_id);
        if ($this->index_id == 0) {
            throw new Exception('Graph not found.');
        }
        
        $stmt = $this->db_cs->prepare("SELECT RRDdatabase_path, RRDdatabase_status_path FROM config");
        $stmt->execute();
        $config = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->dbPath = $config['RRDdatabase_path'];
        $this->dbStatusPath = $config['RRDdatabase_status_path'];
        
        $stmt = $this->db->prepare("SELECT `key`, `value` FROM options");
        $stmt->execute();
        $this->general_opt = $stmt->fetchAll(PDO::FETCH_GROUP|PDO::FETCH_UNIQUE|PDO::FETCH_ASSOC);
    }
    
    public function getGraph($start, $end) {
        $this->_getIndexData();
        $this->extra_datas['start'] = $start;
        $this->extra_datas['end'] = $end;
        $this->setRRDOption("start", $start);
        $this->setRRDOption("end", $end);
        $this->setTemplate();
        $this->init();
        $this->initCurveList();
        $this->createLegend();
        return $this->getJsonStream();
    }
    
    /**
     *
     * Initiate the Graph objects
     */
    public function init() {        
        $this->setRRDOption("imgformat", "JSONTIME");
        if (isset($this->templateInformations["vertical_label"])) {
            $this->extra_datas['vertical-label'] = $this->templateInformations["vertical_label"];
        }

        $this->setRRDOption("slope-mode");

        if (isset($this->templateInformations["base"]) && $this->templateInformations["base"]) {
            $this->extra_datas['base'] = $this->templateInformations["base"];
        }
        if (isset($this->templateInformations["width"]) && $this->templateInformations["width"]) {
            $this->extra_datas['width'] = $this->templateInformations["width"];
            $this->setRRDOption("width", $this->templateInformations["width"]);
        }
        if (isset($this->templateInformations["height"]) && $this->templateInformations["height"]) {
            $this->extra_datas['height'] = $this->templateInformations["height"];
            $this->setRRDOption("height", $this->templateInformations["height"]);
        }

        /*
         * Init Graph Template Value
         */
        if (isset($this->templateInformations["lower_limit"]) && $this->templateInformations["lower_limit"] != NULL) {
            $this->extra_datas['lower-limit'] = $this->templateInformations["lower_limit"];
            $this->setRRDOption("lower-limit", $this->templateInformations["lower_limit"]);
        }
        if (isset($this->templateInformations["upper_limit"]) && $this->templateInformations["upper_limit"] != "") {
            $this->extra_datas['upper-limit'] = $this->templateInformations["upper_limit"];
            $this->setRRDOption("upper-limit", $this->templateInformations["upper_limit"]);
        } elseif (isset($this->templateInformations[""]) && $this->templateInformations["size_to_max"]) {
            $this->extra_datas['size-to-max'] = $this->templateInformations["size_to_max"];
        }

        $this->extra_datas['scaled'] = 1;
        if (isset($this->templateInformations["scaled"]) && $this->templateInformations["scaled"] == "0") {
            $this->extra_datas['scaled'] = 0;
        }
    }
    
    protected function getCurveDsConfig($metric) {
        $ds_data = null;
        
        if (is_null($this->components_ds_cache)) {
            $stmt = $this->db->prepare("SELECT * FROM giv_components_template ORDER BY host_id DESC");
            $stmt->execute();
            $this->components_ds_cache = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        
        $ds_data_associated = null;
        $ds_data_regular = null;
        foreach ($this->components_ds_cache as $ds_val) {
            /* Prepare pattern for metrics */
            $metricPattern = '/^' .  preg_quote($ds_val['ds_name'], '/') . '$/i';
            $metricPattern = str_replace('*', '.*', $metricPattern);

            # Check associated
            if (isset($metric['host_id']) && isset($metric['service_id']) && ($ds_val['host_id'] == $metric['host_id'] || $ds_val['host_id'] == '') &&
                ($ds_val['service_id'] == $metric['service_id'] || $ds_val['service_id'] == '') &&
                preg_match($metricPattern, $metric['metric_name'])) {
                $ds_data_associated = $ds_val;
                break;
            }

            /* Check regular */
            if (is_null($ds_data_regular) && preg_match('/^' . preg_quote($ds_val['ds_name'], '/') . '$/i', $metric['metric_name'])) {
                $ds_data_regular = $ds_val;
            }
        }

        if (!is_null($ds_data_associated)) {
            $ds_data = $ds_data_associated;
        } else if (!is_null($ds_data_regular)) {
            $ds_data = $ds_data_regular;
        }

        if (is_null($ds_data)) {
            if (is_null($this->ds_default)) {
                $stmt = $this->db->prepare("SELECT ds_min, ds_max, ds_minmax_int, ds_last, ds_average, ds_total, ds_tickness, ds_color_line_mode, ds_color_line FROM giv_components_template WHERE default_tpl1 = '1'");
                $stmt->execute();
                $this->ds_default = $stmt->fetch(PDO::FETCH_ASSOC);
            }
            $ds_data = $this->ds_default;
        }
        
        if ($ds_data["ds_color_line_mode"] == '1') {
            $ds_data["ds_color_line"] = $this->getOVDColor($metric["metric_id"]);
        }
        
        return $ds_data;
    }
    
    private function _getLegend($metric) {
        $legend = '';
        if (isset($metric['ds_data']['ds_legend']) && strlen($metric['ds_data']['ds_legend']) > 0 ) {
            $legend = str_replace('"', '\"', $metric['ds_data']['ds_legend']);
        } else {
            if (!isset($metric['ds_data']['ds_name']) || !preg_match('/DS/', $metric['ds_data']['ds_name'], $matches)){
                 $legend = $this->cleanupDsNameForLegend($metric['metric']);
            } else {
                 $legend = (isset($metric['ds_data']['ds_name']) ? $metric['ds_data']['ds_name'] : "");
            }
            $legend = str_replace(":", "\:", $legend);
        }

        if ($metric["unit"] != "") {
            $legend .= " (" . $metric["unit"] . ")";
        }
        
        return $legend;
    }
    
    function dfs(Node $node, $paths=array(), $visited = array()) {        
        $visited[] = $node->name;
        $not_visited = $node->not_visited_nodes($visited);
        if (empty($not_visited)) {
            array_push($paths, $node->name);
            $this->total_paths[] = $paths;
            return;
        }
        foreach ($not_visited as $n) {
            array_push($paths, $node->name);
            $this->dfs($n, $paths, $visited);
            array_pop($paths);
        }
    }
    
    private function _manageMetrics() {
        $this->vmetrics_order = array();
        
        if (count($this->vmetrics) == 0) {
            return 0;
        }
        foreach ($this->vmetrics as $vmetric_id => &$tm) {
            $this->vnodes[$vmetric_id] = $vmetric_id;
            
            $rpns = explode(',', $tm['rpn_function']);
            foreach ($rpns as &$rpn) {
                if (isset($this->cache_all_metrics['r:' . $rpn])) {
                    $rpn = 'v' . $this->cache_all_metrics['r:' . $rpn];
                } else if (isset($this->cache_all_metrics['v:' . $rpn])) {
                    $vmetric_id_child = $this->cache_all_metrics['v:' . $rpn];                    
                    $this->vnodes_dependencies[$vmetric_id][] = $vmetric_id_child;
                    $rpn = 'vv' . $vmetric_id_child;
                }
            }
            
            $tm['rpn_function'] = implode(',', $rpns);
        }
        
        $this->vmetrics_order = _topological_sort($this->vnodes, $this->vnodes_dependencies);
    }

    public function initCurveList() {
        $stmt = $this->db_cs->prepare("SELECT host_id, service_id, metric_id, metric_name, unit_name, min, max, warn, warn_low, crit, crit_low
                                       FROM metrics AS m, index_data AS i
                                       WHERE index_id = id
                                       AND index_id = :index_id
                                       AND m.hidden = '0'
                                       ORDER BY m.metric_name");
        $stmt->bindParam(':index_id', $this->index_id, PDO::PARAM_INT);
        $stmt->execute();
        $metrics = $stmt->fetchAll(PDO::FETCH_ASSOC);

        
        $stmt = $this->db->prepare("SELECT *
                                    FROM virtual_metrics
                                    WHERE index_id = :index_id
                                    AND vmetric_activate = '1'
                                    ORDER BY vmetric_name");
        $stmt->bindParam(':index_id', $this->index_id, PDO::PARAM_INT);
        $stmt->execute();
        $vmetrics = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        #$mmetrics = array_merge($this->rmetrics, $this->vmetrics);
        $components_ds_cache = NULL;

        foreach ($metrics as $metric) {
            if ($this->CheckDBAvailability($metric["metric_id"])) {
                $this->_log("found metric ". $metric["metric_id"]);

                /*
                 * List of id metrics for rrdcached
                 */
                $this->listMetricsId[] = $metric["metric_id"];

                $this->metrics[$metric["metric_id"]] = array(
                    'metric_id' => $metric["metric_id"],
                    'metric' => $metric["metric_name"],
                    'metric_legend' => $this->cleanupDsNameForLegend($metric["metric_name"]),
                    'unit' => $metric["unit_name"],
                    'hidden' => 0,
                    'min' => $metric["min"],
                    'max' => $metric["max"],
                    'virtual' => 0,
                );
                
                $this->cache_all_metrics['r:' . $metric["metric_name"]] = $metric["metric_id"];

                $ds_data = $this->getCurveDsConfig($metric);
                $this->metrics[$metric['metric_id']]['ds_data'] = $ds_data;

                $this->metrics[$metric['metric_id']]['legend'] = $this->_getLegend($this->metrics[$metric["metric_id"]]);

                $this->metrics[$metric['metric_id']]["stack"] = (isset($ds_data["ds_stack"]) && $ds_data["ds_stack"] ? $ds_data["ds_stack"] : 0);
                
                # Look also ds invert
                $this->metrics[$metric["metric_id"]]["warn"] = $metric["warn"];
                $this->metrics[$metric["metric_id"]]["warn_low"] = $metric["warn_low"];
                $this->metrics[$metric["metric_id"]]["crit"] = $metric["crit"];
                $this->metrics[$metric["metric_id"]]["crit_low"] = $metric["crit_low"];
                if (!isset($ds_data["ds_color_area_warn"]) || empty($ds_data["ds_color_area_warn"])) {
                    $this->metrics[$metric["metric_id"]]["ds_color_area_warn"] = $this->general_opt["color_warning"]['value'];
                }
                if (!isset($ds_data["ds_color_area_crit"]) || empty($ds_data["ds_color_area_crit"])) {
                    $this->metrics[$metric["metric_id"]]["ds_color_area_crit"] = $this->general_opt["color_critical"]['value'];
                }
                
                $this->metrics[$metric["metric_id"]]["ds_order"] = (isset($ds_data["ds_order"]) && $ds_data["ds_order"] ? $ds_data["ds_order"] : 0);
            }
        }
        
        foreach ($vmetrics as $vmetric) {
            $this->_log("found vmetric ". $vmetric["vmetric_id"]);
            $this->vmetrics[$vmetric["vmetric_id"]] = array(
                'vmetric_id' => $vmetric["vmetric_id"],
                'metric' => $vmetric["vmetric_name"],
                'metric_legend' => $vmetric["vmetric_name"],
                'unit' => $vmetric['unit_name'],
                'hidden' => isset($vmetric['hidden']) && $vmetric['hidden'] == 1 ? 1 : 0,
                'warn' => $vmetric['warn'],
                'crit' => $vmetric['crit'],
                'def_type' => $vmetric['def_type'] == 1 ? 'VDEF' : 'CDEF',
                'rpn_function' => $vmetric['rpn_function'],
                'virtual' => 1,
            );
            
            $this->cache_all_metrics['v:' . $vmetric["vmetric_name"]] = $vmetric["vmetric_id"];
            
            if ($this->vmetrics[$vmetric["vmetric_id"]]['hidden'] == 0) {
                # Not cleaning. Should have is own metric_id for ods_view_details
                $vmetric['metric_name'] = $vmetric["vmetric_name"];
                $vmetric['metric_id'] = $vmetric["vmetric_id"];
                $ds_data = $this->getCurveDsConfig($vmetric);
                $this->vmetrics[$vmetric["vmetric_id"]]['ds_data'] = $ds_data;
                
                $this->vmetrics[$vmetric["vmetric_id"]]['legend'] = $this->_getLegend($this->vmetrics[$vmetric["vmetric_id"]]);
                $this->vmetrics[$vmetric["vmetric_id"]]["ds_order"] = (isset($ds_data["ds_order"]) && $ds_data["ds_order"] ? $ds_data["ds_order"] : 0);
            }
        }
        
        /*
         * Sort by ds_order,then legend
         */
        uasort($this->metrics, array("CentreonGraphNg", "_cmpmultiple"));

        /*
         * add data definitions for each metric
         */
        foreach ($this->metrics as $metric_id => &$tm) {
            if (isset($tm['ds_data']['ds_invert']) && $tm['ds_data']['ds_invert']) {
                /* Switching RRD options lower-limit & upper-limit */
                if ($this->onecurve && isset($this->_RRDoptions["lower-limit"]) && $this->_RRDoptions["lower-limit"] && isset($this->_RRDoptions["upper-limit"]) && $this->_RRDoptions["upper-limit"]) {
                    $this->switchRRDLimitOption($this->_RRDoptions["lower-limit"],$this->_RRDoptions["upper-limit"]);
                }

                $this->addArgument("DEF:vi" . $metric_id . "=" . $this->dbPath . $metric_id . ".rrd:value:AVERAGE CDEF:v" . $metric_id . "=vi" . $metric_id . ",-1,*");
            } else {
                $this->addArgument("DEF:v" . $metric_id . "=" . $this->dbPath . $metric_id . ".rrd:value:AVERAGE");
            }
        }
        
        # Order is mandatory for CDEF and VDEF...
        $this->_manageMetrics();
        
        foreach ($this->vmetrics_order as $vmetric_id) {
            $this->addArgument($this->vmetrics[$vmetric_id]['def_type'] . ":vv" . $vmetric_id . "=" . $this->vmetrics[$vmetric_id]['rpn_function']);
        }
    }
    
    /**
     *
     * Enter description here ...
     * @param unknown_type $lower
     * @param unknown_type $upper
     */
    private function switchRRDLimitOption($lower = null, $upper = null) {
        if (is_null($lower)) {
            unset($this->_RRDoptions["upper-limit"]);
            unset($this->extra_datas['upper-limit']);
        } else {
            $this->_RRDoptions["upper-limit"] = $lower;
            $this->extra_datas['upper-limit'] = $lower;
        }
        if (is_null($upper)) {
            unset($this->_RRDoptions["lower-limit"]);
            unset($this->extra_datas['lower-limit']);
        } else {
            $this->_RRDoptions["lower-limit"] = $upper;
            $this->extra_datas['lower-limit'] = $upper;
        }
    }

    /**
    * Clean up ds name in Legend
    *
    * @param string $dsname
    * @param bool $reverse set to true if we want to retrieve the original string to display
    * @return string
    */
    protected function cleanupDsNameForLegend($dsname) {
        $newDsName = str_replace(array("'", "\\"), array(" ", "\\\\"), $dsname);
        return $newDsName;
    }

    /**
     *
     * Enter description here ...
     * @param unknown_type $metrics
     */
    public function setMetricList($metrics)
    {
        if (is_array($metrics) && count($metrics)) {
            $this->metricsEnabled = array_keys($metrics);
        } else if ($metrics != "") {
            $this->metricsEnabled = array($metrics);
        }
    }
    
    private function _legendAddPrint($metric, $metric_id, $is_virtual=0) {
        $vdefs = "";
        $prints = "";
        $prefix = 'v';
        if ($is_virtual == 1) {
            $prefix = 'vv';
        }
        
        foreach (array("last" => "LAST", "min" => "MINIMUM", "max" => "MAXIMUM",
                       "average" => "AVERAGE", "total" => "TOTAL") as $name => $cf) {
            if (!$metric['ds_data']['ds_' . $name]) {
                continue;
            }
            
            $dispname = ucfirst($name);
            if (isset($metric['ds_data']['ds_invert']) && $metric['ds_data']['ds_invert']) {
                $vdefs .= "VDEF:" . $prefix . "i" . $metric_id . $dispname . "="
                . $prefix . 'i' . $metric_id . "," . $cf . " ";
            } else {
                $vdefs .= "VDEF:" . $prefix . $metric_id . $dispname . "="
                    . $prefix . $metric_id . "," . $cf . " ";
            }
            if (($name == "min" || $name == "max") &&
                (isset($metric['ds_data']['ds_minmax_int']) && $metric['ds_data']['ds_minmax_int'])) {
                $displayformat = "%.0lf";
            } else {
                $displayformat = "%.2lf";
            }
            if (isset($metric['ds_data']['ds_invert']) && $metric['ds_data']['ds_invert']) {
                $prints .= "GPRINT:" . $prefix . "i" . $metric_id . $dispname . ":\""
                    . $dispname . "\:" . $displayformat. "\" ";
            } else {
                $prints .= "GPRINT:" . $prefix . $metric_id  . $dispname . ":\""
                    . $dispname . "\:" . $displayformat . "\" ";
            }
        }
        
        $this->addArgument($vdefs);
        $this->addArgument($prints);
    }

    /**
     *
     * Create Legend on the graph
     */
    public function createLegend() {
        foreach ($this->metrics as $metric_id => $tm) {
            $arg = "LINE1:v" . $metric_id . "#0000ff:v" . $metric_id;
            $this->addArgument($arg);
            $this->_legendAddPrint($tm, $metric_id);
        }
        
        foreach ($this->vmetrics_order as $vmetric_id) {
            if ($this->vmetrics[$vmetric_id]['hidden'] == 1) {
                continue;
            }
            
            $arg = "LINE1:vv" . $vmetric_id . "#0000ff:vv" . $vmetric_id;
            $this->addArgument($arg);
            $this->_legendAddPrint($this->vmetrics[$vmetric_id], $vmetric_id, 1);
        }
    }

    /**
     *
     * Enter description here ...
     * @param unknown_type $l_value
     * @param unknown_type $l_unit
     */
    private function humanReadable($l_value = null, $l_unit) {
        if (empty($l_value)) {
            return;
        }

        if ($l_unit == 'B' || $l_unit == 'o' || $l_unit == 'b/s') {
            if (isset($this->_RRDoptions["base"])) {
                $l_base = $this->_RRDoptions["base"];
            } else {
                $l_base = 1000;
            }
            
            $l_px = array( "8" => array("1000" => "Y", "1024" =>"Yi"), "7" => array("1000" => "Z", "1024" =>"Zi"), "6" => array("1000" => "E", "1024" =>"Ei"), "5" => array("1000" => "P", "1024" =>"Pi"), "4" => array("1000" => "T", "1024" =>"Ti"), "3" => array("1000" => "G", "1024" =>"Gi"), "2" => array("1000" => "M", "1024" =>"Mi"), "1" => array("1000" => "K", "1024" =>"Ki"));
            $l_sign ="";
            if ($l_value < 0) {
                $l_sign = "-";
                $l_value *= -1;
            }
            $l_cpx = 0;
            while ($l_value > $l_base) {
                $l_value /= $l_base;
                $l_cpx++;
            }
            $l_upx = $l_px[$l_cpx][$l_base];
            return $l_sign.sprintf("%.2f",$l_value).$l_upx.$l_unit;
        }

        return sprintf("%.2f", $l_value) . $l_unit;
    }

    /**
     *
     * Enter description here ...
     */
    private function _getDefaultGraphTemplate() {
        $template_id = $this->_getServiceGraphID();
        if ($template_id != "") {
            $this->template_id = $template_id;
            return;
        } else {
            $command_id = getMyServiceField($this->indexData["service_id"], "command_command_id");
            $stmt = $this->db->prepare("SELECT graph_id FROM command WHERE `command_id` = :command_id");
            $stmt->bindParam(':command_id', $command_id, PDO::PARAM_INT);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!is_null($row) && $row["graph_id"] != 0) {
                $this->template_id = $row["graph_id"];
                return;
            }
        }
        
        $stmt = $this->db->prepare("SELECT graph_id FROM giv_graphs_template WHERE default_tpl1 = '1'");
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->template_id = $row["graph_id"];
    }

    /**
     *
     * Enter description here ...
     */
    private function _getServiceGraphID() {
        $service_id = $this->indexData["service_id"];

        $stmt = $this->db->prepare("SELECT esi.graph_id, service_template_model_stm_id FROM service LEFT JOIN extended_service_information esi ON esi.service_service_id = service_id WHERE service_id = :service_id");
        $tab = array();
        while (1) {
            $stmt->bindParam(':service_id', $service_id, PDO::PARAM_INT);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row["graph_id"]) {
                $this->graphID = $row["graph_id"];
                return $this->graphID;
            } elseif ($row["service_template_model_stm_id"]) {
                if (isset($tab[$row['service_template_model_stm_id']])) {
                    break;
                }
                $service_id = $row["service_template_model_stm_id"];
                $tab[$service_id] = 1;
            } else {
                break;
            }
        }
        
        return $this->graphID;
    }

    /**
     *
     * Get index Data
     */
    private function _getIndexData() {
        $this->_log("index_data for " . $this->index_id);
        $stmt = $this->db_cs->prepare("SELECT * FROM index_data WHERE id = :index_id");
        $stmt->bindParam(':index_id', $this->index_id, PDO::PARAM_INT);
        $stmt->execute();
        $this->indexData = $stmt->fetch(PDO::FETCH_ASSOC);
        if (preg_match("/meta_([0-9]*)/", $this->indexData["service_description"], $matches)) {
            $stmt = $this->db->prepare("SELECT meta_name FROM meta_service WHERE `meta_id` = :meta_id");
            $stmt->bindParam(':meta_id', $matches[1], PDO::PARAM_INT);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->indexData["service_description"] = $row["meta_name"];
        }
        
        if ($this->indexData["host_name"] != "_Module_Meta") {            
            $this->extra_datas['title'] = $this->indexData['service_description'] . " " . _("graph on") . " " . $this->indexData['host_name'];
        } else {
            $this->extra_datas['title'] = _("Graph") . " " . $this->indexData["service_description"];
        }
    }
    
    /**
     *
     * Enter description here ...
     * @param unknown_type $template_id
     */
    public function setTemplate($template_id = null) {
        if (!isset($template_id) || !$template_id){
            if ($this->indexData["host_name"] != "_Module_Meta") {
                /*
                 * graph is based on real host/service
                 */
                $this->_getDefaultGraphTemplate();
            } else {
                /*
                 * Graph is based on a module check point
                 */
                $stmt = $this->db->prepare("SELECT graph_id FROM meta_service WHERE `meta_name` = :meta_name");
                $stmt->bindParam(':meta_name', $this->indexData["service_description"], PDO::PARAM_STR);
                $stmt->execute();
                $meta = $stmt->fetch(PDO::FETCH_ASSOC);
                $this->template_id = $meta["graph_id"];
            }
        } else {
            $this->template_id = htmlentities($_GET["template_id"], ENT_QUOTES, "UTF-8");
        }
        
        $stmt = $this->db->prepare("SELECT * FROM giv_graphs_template WHERE graph_id = :graph_id");
        $stmt->bindParam(':graph_id', $this->template_id, PDO::PARAM_INT);
        $stmt->execute();
        $this->templateInformations = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     *
     * Display Start and end time on graph
     * @param $arg
     */
    public function addArgument($arg)
    {
        $this->_arguments[] = $arg;
    }

    /**
     *
     * Enter description here ...
     * @param unknown_type $name
     * @param unknown_type $value
     */
    public function setColor($name, $value)
    {
        $this->_colors[$name] = $value;
    }

    /**
     *
     * Enter description here ...
     * @param unknown_type $name
     * @param unknown_type $value
     */
    public function setRRDOption($name, $value = null)
    {
        if (strpos($value, " ")!==false) {
            $value = "'".$value."'";
        }
        $this->_RRDoptions[$name] = $value;
    }

    /**
     *
     * Enter description here ...
     * @param unknown_type $flag
     */
    public function setCommandLineTimeLimit($flag)
    {
        if (isset($flag))
            $this->_flag = $flag;
    }

    /**
     *
     * Enter description here ...
     * @param unknown_type $name
     * @param unknown_type $bool
     */
    public function setOption($name, $bool = true) {
        $this->_options[$name] = $bool;
    }

    /**
     *
     * Enter description here ...
     * @param unknown_type $name
     */
    public function getOption($name) {
        if (isset($this->_options[$name])) {
            return $this->_options[$name];
        }
        
        return false;
    }

    private function _formatByMetrics($rrd_data) {
        $this->graph_data['times'] = array();
        $size = count($rrd_data['data']);
        $gprints_size = count($rrd_data['meta']['gprints']);
        
        for ($i = 0; $i < $size; $i++) {
            $this->graph_data['times'][] = $rrd_data['data'][$i][0];
        }
        
        $i = 1;
        $gprints_pos = 0;
        foreach ($this->graph_data['metrics'] as &$metric) {
            $metric['data'] = array();
            $metric['prints'] = array();
            
            $insert = 0;
            if ($metric['virtual'] == 0) {
                $metric_fullname = 'v' . $metric['metric_id'];
            } else {
                $metric_fullname = 'vv' . $metric['vmetric_id'];
            }
            for (; $gprints_pos < $gprints_size; $gprints_pos++) {
                if (isset($rrd_data['meta']['gprints'][$gprints_pos]['line'])) {
                    if ($rrd_data['meta']['gprints'][$gprints_pos]['line'] == $metric_fullname) {
                        $insert = 1;
                    } else {
                        break;
                    }
                } else if ($insert == 1) {
                    $metric['prints'][] = array_values($rrd_data['meta']['gprints'][$gprints_pos]);
                }
            }
            
            for ($j = 0; $j < $size; $j++) {
                $metric['data'][] = $rrd_data['data'][$j][$i];
            }
            $i++;
        }
    }

    /**
     *
     * Enter description here ...
     */
    public function getJsonStream() {
        $commandLine = "";

        /*
         * Send header
         */

        $this->flushRrdcached($this->listMetricsId);

        $commandLine = " graph - ";

        foreach ($this->_RRDoptions as $key => $value) {
            $commandLine .= "--".$key;
            if (isset($value)) {
                if (preg_match('/\'/', $value)) {
                    $value = "'" . preg_replace('/\'/', ' ', $value) . "'";
                }
                $commandLine .= "=".$value;
            }
            $commandLine .= " ";
        }

        foreach ($this->_arguments as $arg) {
            $commandLine .= " " . $arg . " ";
        }
        $commandLine = preg_replace("/(\\\$|`)/", "", $commandLine);
        $this->_log($commandLine);

        if (is_writable($this->general_opt['debug_path']['value'])) {
            $stderr = array('file', $this->general_opt['debug_path']['value'] . '/rrdtool.log', 'a');
        } else {
            $stderr = array('pipe', 'a');
        }
        $descriptorspec = array(
                            0 => array("pipe", "r"),  // stdin est un pipe processus va lire
                            1 => array("pipe", "w"),  // stdout est un pipe processus va ecrire
                            2 => $stderr // stderr est un fichier
                        );

        $process = proc_open($this->general_opt['rrdtool_path_bin']['value'] . " - ", $descriptorspec, $pipes, NULL, NULL);
        $this->graph_data = array(
            'global' => $this->extra_datas,
            'metrics' => array(),
        );
        foreach ($this->metrics as $metric) {
            $this->graph_data['metrics'][] = $metric;
        }
        foreach ($this->vmetrics_order as $vmetric_id) {
            if ($this->vmetrics[$vmetric_id]['hidden'] == 1) {
                continue;
            }
            
            $this->graph_data['metrics'][] = $this->vmetrics[$vmetric_id];
        }
        
        if (is_resource($process)) {
            fwrite($pipes[0], $commandLine);
            fclose($pipes[0]);

            $str = stream_get_contents($pipes[1]);
            $return_value = proc_close($process);

            $str = preg_replace("/OK u:.*$/", "", $str);
            $rrd_data = json_decode($str, true);
        }
        
        $this->_formatByMetrics($rrd_data);
        return $this->graph_data;
    }

    /**
     *
     * Enter description here ...
     * @param unknown_type $name
     * @param unknown_type $tab
     * @param unknown_type $defaultValue
     */
    public function checkArgument($name, $tab, $defaultValue) {
        if (isset($name) && isset($tab)) {
            if (isset($tab[$name])) {
                return htmlentities($tab[$name], ENT_QUOTES, "UTF-8");
            } else {
                return htmlentities($defaultValue, ENT_QUOTES, "UTF-8");
            }
        }
    }

    /**
     *
     * Enter description here ...
     * @param unknown_type $l_mid
     */
    public function getOVDColor($metric_id) {
        if (is_null($this->color_cache)) {
            $this->color_cache = array();
            
            $stmt = $this->db->prepare("SELECT metric_id, rnd_color FROM `ods_view_details` WHERE `index_id` = :index_id AND `contact_id` = :contact_id");
            $stmt->bindParam(':contact_id', $this->user_id, PDO::PARAM_INT);
            $stmt->bindParam(':index_id', $this->index_id, PDO::PARAM_INT);
            $stmt->execute();
            $this->color_cache = $stmt->fetchAll(PDO::FETCH_GROUP|PDO::FETCH_UNIQUE|PDO::FETCH_ASSOC);   
            
            $this->templateInformations = $stmt->fetch(PDO::FETCH_ASSOC);
        }
        
        if (isset($this->color_cache[$metric_id]) && preg_match("/^\#[a-f0-9]{6,6}/i", $this->color_cache[$metric_id]['rnd_color'])) {
            return $this->color_cache[$metric_id]['rnd_color'];
        }
        $l_rndcolor = $this->getRandomWebColor();
        $stmt = $this->db->prepare("INSERT INTO `ods_view_details` (rnd_color, index_id, metric_id, contact_id) VALUES (:rnd_color, :index_id, :metric_id, :contact_id)");
        $stmt->bindParam(':rnd_color', $l_rndcolor, PDO::PARAM_STR);
        $stmt->bindParam(':index_id', $this->index_id, PDO::PARAM_INT);
        $stmt->bindParam(':metric_id', $metric_id, PDO::PARAM_INT);
        $stmt->bindParam(':contact_id', $this->user_id, PDO::PARAM_INT);
        $stmt->execute();
        return $l_rndcolor;
    }

    /**
     *
     * Enter description here ...
     */
    public  function getRandomWebColor() {
        $web_safe_colors = array('#000033', '#000066', '#000099', '#0000cc',
            '#0000ff', '#003300', '#003333', '#003366', '#003399', '#0033cc',
            '#0033ff', '#006600', '#006633', '#006666', '#006699', '#0066cc',
            '#0066ff', '#009900', '#009933', '#009966', '#009999', '#0099cc',
            '#0099ff', '#00cc00', '#00cc33', '#00cc66', '#00cc99', '#00cccc',
            '#00ccff', '#00ff00', '#00ff33', '#00ff66', '#00ff99', '#00ffcc',
            '#00ffff', '#330000', '#330033', '#330066', '#330099', '#3300cc',
            '#3300ff', '#333300', '#333333', '#333366', '#333399', '#3333cc',
            '#3333ff', '#336600', '#336633', '#336666', '#336699', '#3366cc',
            '#3366ff', '#339900', '#339933', '#339966', '#339999', '#3399cc',
            '#3399ff', '#33cc00', '#33cc33', '#33cc66', '#33cc99', '#33cccc',
            '#33ccff', '#33ff00', '#33ff33', '#33ff66', '#33ff99', '#33ffcc',
            '#33ffff', '#660000', '#660033', '#660066', '#660099', '#6600cc',
            '#6600ff', '#663300', '#663333', '#663366', '#663399', '#6633cc',
            '#6633ff', '#666600', '#666633', '#666666', '#666699', '#6666cc',
            '#6666ff', '#669900', '#669933', '#669966', '#669999', '#6699cc',
            '#6699ff', '#66cc00', '#66cc33', '#66cc66', '#66cc99', '#66cccc',
            '#66ccff', '#66ff00', '#66ff33', '#66ff66', '#66ff99', '#66ffcc',
            '#66ffff', '#990000', '#990033', '#990066', '#990099', '#9900cc',
            '#9900ff', '#993300', '#993333', '#993366', '#993399', '#9933cc',
            '#9933ff', '#996600', '#996633', '#996666', '#996699', '#9966cc',
            '#9966ff', '#999900', '#999933', '#999966', '#999999', '#9999cc',
            '#9999ff', '#99cc00', '#99cc33', '#99cc66', '#99cc99', '#99cccc',
            '#99ccff', '#99ff00', '#99ff33', '#99ff66', '#99ff99', '#99ffcc',
            '#99ffff', '#cc0000', '#cc0033', '#cc0066', '#cc0099', '#cc00cc',
            '#cc00ff', '#cc3300', '#cc3333', '#cc3366', '#cc3399', '#cc33cc',
            '#cc33ff', '#cc6600', '#cc6633', '#cc6666', '#cc6699', '#cc66cc',
            '#cc66ff', '#cc9900', '#cc9933', '#cc9966', '#cc9999', '#cc99cc',
            '#cc99ff', '#cccc00', '#cccc33', '#cccc66', '#cccc99', '#cccccc',
            '#ccccff', '#ccff00', '#ccff33', '#ccff66', '#ccff99', '#ccffcc',
            '#ccffff', '#ff0000', '#ff0033', '#ff0066', '#ff0099', '#ff00cc',
            '#ff00ff', '#ff3300', '#ff3333', '#ff3366', '#ff3399', '#ff33cc',
            '#ff33ff', '#ff6600', '#ff6633', '#ff6666', '#ff6699', '#ff66cc',
            '#ff66ff', '#ff9900', '#ff9933', '#ff9966', '#ff9999', '#ff99cc',
            '#ff99ff', '#ffcc00', '#ffcc33', '#ffcc66', '#ffcc99', '#ffcccc',
            '#ffccff');
            return $web_safe_colors[rand(0,sizeof($web_safe_colors)-1)];
    }

    /**
     *
     * Enter description here ...
     * @param unknown_type $a
     * @param unknown_type $b
     */
    private function _cmpmultiple($a, $b) {
        if (isset($a["ds_order"]) && isset($b["ds_order"])) {
            if ($a["ds_order"] < $b["ds_order"])
                return -1;
            else if ($a["ds_order"] > $b["ds_order"])
                return 1;
        }
        return strnatcasecmp((isset($a["legend"]) && $a["legend"]) ? $a["legend"] : null,
                             (isset($b["legend"]) && $b["legend"]) ? $b["legend"] : null);
    }

    /**
     *
     * Enter description here ...
     * @param unknown_type $message
     */
    private function _log($message) {
        if ($this->general_opt['debug_rrdtool']['value'] && is_writable($this->general_opt['debug_path']['value'])) {
            error_log("[" . date("d/m/Y H:i") ."] RDDTOOL : ".$message." \n", 3, $this->general_opt['debug_path']['value'] . "rrdtool.log");
        }
    }

    /**
     *
     * Enter description here ...
     * @param unknown_type $metric_id
     */
    private function checkDBAvailability($metric_id) {
        if (!file_exists($this->dbPath.$metric_id.".rrd") && !preg_match("/^v/",$metric_id)) {
            return 0;
        }
        return 1;
    }

    /**
     * Flush metrics in rrdcached
     *
     * @param array $metricsId The list of metrics
     * @return bool
     */
    protected function flushRrdcached($metricsId) {
        if (!isset($this->general_opt['rrdcached_enable']['value'])
            || $this->general_opt['rrdcached_enable']['value'] == 0) {
            return true;
        }

        /*
         * Connect to rrdcached
         */
        $errno = 0;
        $errstr = '';
        if (isset($this->general_opt['rrdcached_port']['value'])
            && trim($this->general_opt['rrdcached_port']['value']) != '') {
            $sock = @fsockopen('127.0.0.1', trim($this->general_opt['rrdcached_port']['value']), $errno, $errstr);
            if ($sock === false) {
                return false;
            }
        } elseif (isset($this->general_opt['rrdcached_unix_path']['value'])
            && trim($this->general_opt['rrdcached_unix_path']['value']) != '') {
            $sock = @fsockopen('unix://' . trim($this->general_opt['rrdcached_unix_path']['value']), $errno, $errstr);
        } else {
            return false;
        }
        if (false === $sock) {
            // @todo log the error
            return false;
        }
        /*
         * Run batch mode
         */
        if (false === fputs($sock, "BATCH\n")) {
            @fclose($sock);
            return false;
        }
        if (false === fgets($sock)) {
            @fclose($sock);
            return false;
        }
        /*
         * Run flushs
         */
        foreach ($metricsId as $metricId) {
            $fullpath = realpath($this->dbPath . $metricId . '.rrd');
            $cmd = 'FLUSH ' . $fullpath;
            if (false === fputs($sock, $cmd . "\n")) {
                @fclose($sock);
                return false;
            }
        }
        /*
         * Execute commands
         */
        if (false === fputs($sock, ".\n")) {
            @fclose($sock);
            return false;
        }
        if (false === fgets($sock)) {
            @fclose($sock);
            return false;
        }
        /*
         * Send close
         */
        fputs($sock, "QUIT\n");
        @fclose($sock);
        return true;
    }
    
    /**
     * Returns index data id
     * 
     * @param int $hostId
     * @param int $serviceId
     * @return int
     */
    public function getIndexDataId($hostId, $serviceId) {
        $stmt = $this->db_cs->prepare("SELECT id FROM index_data WHERE host_id = :host_id AND service_id = :service_id");
        $stmt->bindParam(':host_id', $hostId, PDO::PARAM_INT);
        $stmt->bindParam(':service_id', $serviceId, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return is_null($row) ? 0 : $row['id'];
    }
    
    /**
     * Returns true if status graph exists
     * 
     * @param int $hostId
     * @param int $serviceId
     * @return bool
     */
    public function statusGraphExists($hostId, $serviceId) {
        $id = $this->getIndexDataId($hostId, $serviceId);
        if (is_file($this->dbStatusPath."/".$id.".rrd")) {
            return true;
        }
        return false;
    }
    
}
