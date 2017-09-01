<?php

use Centreon\Test\Behat\CentreonContext;

//use Centreon\Test\Behat\Configuration\LdapConfigurationPage;

class ClapiContext extends CentreonContext

{
    protected $test;
    protected $object;
    protected $parameter;
    protected $file;


    public function useClapiAction($object, $action, $value = '')
    {
        $output = $this->container->execute(
            "centreon -u admin -p centreon -o " . $object . " -a " . $action . " -v '" . $value . "'",
            'web'
        );
        return $output;
    }


    public function exportClapiAction($selectList = array(), $filter = null, $file = null)
    {
        $cmd = "centreon -u admin -p centreon -e";
        if (!empty($selectList)) {
            foreach ($selectList as $select) {
                $cmd .= " --select='" . $select . "'";
            }
        }
        if ($filter) {
            $cmd .= " --filter='" . $filter . "'";
        }
        if ($file) {
            $cmd .= " > " . $file;
        }

        $output = $this->container->execute(
            $cmd,
            'web'
        );
        return $output;
    }


    public function importClapiAction($file)
    {
        $cmd = "centreon -u admin -p centreon -i " . $file;
        $output = $this->container->execute(
            $cmd,
            'web'
        );
        return $output;
    }


    /**
     * @Given a ldap configuration
     */
    public function aLdapConfiguration()
    {
        $this->test = 'LDAP';
        $this->object = array('LDAP');
        $this->parameter['LDAP']['name'] = 'ldapconfiguration';
        $this->parameter['LDAP']['parameter']['description'] = 'ldapdescription';
        $this->parameter['LDAP']['parameter']['alias'] = 'ldapalias';
        $this->parameter['LDAP']['parameter']['serverName'] = 'ldapServer';
        $this->parameter['LDAP']['parameter']['serverPort'] = '389';


        //add
        $v = $this->parameter['LDAP']['name'] . ";" . $this->parameter['LDAP']['parameter']['description'];
        $this->useClapiAction($this->test, 'ADD', $v);


        //set param
        $v = $this->parameter['LDAP']['name'] . ";alias;" . $this->parameter['LDAP']['parameter']['alias'];
        $this->useClapiAction($this->test, 'SETPARAM', $v);

        //add server
        $v = $this->parameter['LDAP']['name'] . ";" . $this->parameter['LDAP']['parameter']['serverName'] . ";42;0;1";
        $this->useClapiAction($this->test, 'ADDSERVER', $v);

        //show server
        $v = $this->parameter['LDAP']['name'];
        $output = $this->useClapiAction($this->test, 'SHOWSERVER', $v);

        $dataServer = explode("\n", $output['output'])[1];
        $id = explode(';', $dataServer)[0];

        //set param server
        $v = $id . ";host_port;" . $this->parameter['LDAP']['parameter']['serverPort'];
        $this->useClapiAction($this->test, 'SETPARAMSERVER', $v);
    }


    /**
     * @When I export my ldap configuration and I delete it from centreon
     */
    public function iExportMyConfigurationAndIDeleteItFromCentreon()
    {
        $this->file['fileinit'] = '/tmp/' . $this->test . 'init.txt';
        $this->file['filedelete'] = '/tmp/' . $this->test . 'delete.txt';
        $this->file['filecompare'] = '/tmp/' . $this->test . 'compare.txt';

        $filter = array($this->test . ';' . $this->parameter[$this->test]['name']);

        //export ldap
        $this->exportClapiAction($filter, null, $this->file['fileinit']);

        //delete ldap
        $v = $this->parameter[$this->test]['name'];
        $this->useClapiAction($this->test, 'DEL', $v);

        //export deleted ldap
        $this->exportClapiAction($filter, null, $this->file['filedelete']);

        if (!file_exists($this->file['fileinit']) ||
            file_get_contents($this->file['fileinit'], FILE_USE_INCLUDE_PATH) === "") {
            throw new \Exception('File not generated');
        }

        if (file_get_contents($this->file['filedelete'], FILE_USE_INCLUDE_PATH) !== "") {
            throw new \Exception('Configuration not delete');
        };

        $this->container->copyToContainer(
            $this->file['fileinit'],
            $this->file['fileinit'],
            'web'
        );

    }

    /**
     * @Then I can import this configuration
     */
    public function iCanImportThisConfiguration()
    {

        $this->importClapiAction($this->file['fileinit']);
        foreach ($this->object as $object) {
            $v = $this->parameter[$object]['name'];
            $output = $this->useClapiAction($this->test, 'SHOW', $v);
            $dataServer = explode("\n", $output['output']);
            for ($i = 1; $i < count($dataServer); $i++) {
                $list[] = explode(';', $dataServer[$i])[1];
            }
        }

        if (!in_array($this->parameter[$this->test]['name'], $list)) {
            throw new \Exception('Configuration not imported');
        }
    }




    /**
     * @Given a host configuration
     */
    public function aHostConfiguration()
    {
        $this->test = 'HOST';
        $this->object = array('HOST', 'SERVICE');
        $this->parameter['HOST']['name'] = 'hostname';
        $this->parameter['HOST']['parameter']['description'] = 'hostdescription';
        $this->parameter['HOST']['parameter']['alias'] = 'hostalias';
        $this->parameter['SERVICE']['name'] = 'servicename';
        $this->parameter['SERVICE']['parameter']['description'] = 'servicedescription';
        $this->parameter['SERVICE']['parameter']['alias'] = 'servicealias';

        //add
        $v = $this->parameter['LDAP']['name'] . ";" . $this->parameter['LDAP']['parameter']['description'];
        $this->useClapiAction($this->test, 'ADD', $v);

        //set param
        $v = $this->parameter['LDAP']['name'] . ";alias;" . $this->parameter['LDAP']['parameter']['alias'];
        $this->useClapiAction($this->test, 'SETPARAM', $v);

        //add server
        $v = $this->parameter['LDAP']['name'] . ";" . $this->parameter['LDAP']['parameter']['serverName'] . ";42;0;1";
        $this->useClapiAction($this->test, 'ADDSERVER', $v);

        //show server
        $v = $this->parameter['LDAP']['name'];
        $output = $this->useClapiAction($this->test, 'SHOWSERVER', $v);

        $dataServer = explode("\n", $output['output'])[1];
        $id = explode(';', $dataServer)[0];

        //set param server
        $v = $id . ";host_port;" . $this->parameter['LDAP']['parameter']['serverPort'];
        $this->useClapiAction($this->test, 'SETPARAMSERVER', $v);
    }






























}
