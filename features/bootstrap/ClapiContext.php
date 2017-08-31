<?php

use Centreon\Test\Behat\CentreonContext;

//use Centreon\Test\Behat\Configuration\LdapConfigurationPage;

class ClapiContext extends CentreonContext

{
    protected $object;

    /**
     * @Given a ldap configuration
     */
    public function aLdapConfiguration()
    {
        $this->object['name'] = 'ldapconfiguration';
        $this->object['description'] = 'ldapdescription';
        $this->object['alias'] = 'ldapalias';
        $this->object['serverName'] = 'ldapServer';
        $this->object['serverPort'] = '389';

        //add
        $this->container->execute(
            "centreon -u admin -p centreon -o LDAP -a ADD -v '" .
            $this->object['name'] . ";" . $this->object['description'] . "'",
            'web'
        );

        //set param
        $this->container->execute(
            "centreon -u admin -p centreon -o LDAP -a SETPARAM -v '" .
            $this->object['name'] . ";alias;" . $this->object['alias'] . "'",
            'web'
        );

        //add server
        $this->container->execute(
            "centreon -u admin -p centreon -o LDAP -a ADDSERVER -v '" .
            $this->object['name'] . ";" . $this->object['serverName'] . ";42;0;1" . "'",
            'web'
        );

        //show server
        $output = $this->container->execute(
            "centreon -u admin -p centreon -o LDAP -a SHOWSERVER -v '" . $this->object['name'] . "'",
            'web'
        );

        $dataServer = explode("\n", $output['output'])[1];
        $id = explode(';', $dataServer)[0];

        //set param server
        $this->container->execute(
            "centreon -u admin -p centreon -o LDAP -a SETPARAMSERVER -v '" .
            $id . ";host_port;" . $this->object['serverPort'] . "'",
            'web'
        );

    }

    /**
     * @When I export my ldap configuration and I delete it from centreon
     */
    public function iExportMyLdapConfigurationAndIDeleteItFromCentreon()
    {
        $this->object['fileinit'] = '/tmp/ldapinit.txt';
        $this->object['filedelete'] = '/tmp/ldapdelete.txt';
        $this->object['filecompare'] = '/tmp/ldapcompare.txt';


        //export ldap
        $this->container->executeshell(
            "centreon -u admin -p centreon -e --select='LDAP;" . $this->object['name'] .
            "' > " . $this->object['fileinit'],
            'web'
        );

        //delete ldap
        $this->container->execute(
            "centreon -u admin -p centreon -o LDAP -a DEL -v " . $this->object['name'],
            'web'
        );

        //export deleted ldap
        $this->container->execute(
            "centreon -u admin -p centreon -e --select='LDAP;" .
            $this->object['name'] . "' > " . $this->object['filedelete'],
            'web'
        );

        if (!file_exists($this->object['fileinit']) ||
            file_get_contents($this->object['fileinit'], FILE_USE_INCLUDE_PATH) === "") {
            throw new \Exception('File not generated');
        }

        if (file_get_contents($this->object['filedelete'], FILE_USE_INCLUDE_PATH) !== "") {
            throw new \Exception('Configuration not delete');
        };

        $this->container->copyToContainer(
            $this->object['fileinit'],
            $this->object['fileinit'],
            'web'
        );

    }

    /**
     * @Then I can import this configuration
     */
    public function iCanImportThisConfiguration()
    {
        //import ldap
        $this->container->execute(
            "centreon -u admin -p centreon -i " . $this->object['fileinit'],
            'web'
        );

        //export imported configuration ldap
        $this->container->execute(
            "centreon -u admin -p centreon -e --select='LDAP;" .
            $this->object['name'] . "' > " . $this->object['filecompare'],
            'web'
        );

        if (file_get_contents($this->object['fileinit'], FILE_USE_INCLUDE_PATH) !==
            file_get_contents($this->object['filecompare'], FILE_USE_INCLUDE_PATH)) {
            throw new \Exception('Configuration not imported');
        };

        unlink($this->object['fileinit']);
        unlink($this->object['filedelete']);
        unlink($this->object['filecompare']);
    }
}
