<?php

use Centreon\Test\Behat\CentreonContext;
use Centreon\Test\Behat\Configuration\ContactConfigurationPage;
use Centreon\Test\Behat\Configuration\ContactGroupsConfigurationPage;
use Centreon\Test\Behat\Configuration\ContactGroupConfigurationListingPage;
use Centreon\Test\Behat\Administration\ACLGroupConfigurationPage;
use Centreon\Test\Behat\Administration\ACLGroupConfigurationListingPage;
use Centreon\Test\Behat\Administration\ACLMenuConfigurationPage;
use Centreon\Test\Behat\Administration\ACLActionConfigurationPage;
use Centreon\Test\Behat\Administration\ACLResourceConfigurationPage;

class AclAccessGroupsContext extends CentreonContext
{
    protected $currentPage;

    protected $adminContact1 = array(
        'name' => 'adminContact1Name',
        'alias' => 'adminContact1Alias',
        'email' => 'adminContact1@localhost',
        'admin' => 1
    );

    protected $adminContact2 = array(
        'name' => 'adminContact2Name',
        'alias' => 'adminContact2Alias',
        'email' => 'adminContact2@localhost',
        'admin' => 1
    );

    protected $adminContactGroup = array(
        'name' => 'adminContactGroupName',
        'alias' => 'adminContactGroupAlias',
        'contacts' => array(
            'adminContact2Name',
            'adminContact1Name'
        )
    );

    protected $nonAdminContactGroup = array(
        'name' => 'nonAdminContactGroupName',
        'alias' => 'nonAdminContactGroupAlias',
        'contacts' => array(
            'Guest',
            'User'
        )
    );

    protected $aclGroupScenario1 = array(
        'group_name' => 'scenario1Name',
        'group_alias' => 'scenario1Alias',
        'contactgroups' => 'nonAdminContactGroupName'
    );


    protected $aclGroupScenario2 = array(
        'group_name' => 'scenario2Name',
        'group_alias' => 'scenario2Alias',
        'contactgroups' => 'adminContactGroupName'
    );

    protected $aclResource1 = array(
        'acl_name' => 'aclResource1Name'
    );

    protected $aclAction1 = array(
        'acl_name' => 'aclAction1Name',
        'acl_alias' => 'aclActionAlias',
        'acl_groups' => 'ALL'
    );

    protected $aclMenu1 = array(
        'acl_name' => 'aclMenu1Name'
    );

    protected $aclMenu2 = array(
        'acl_name' => 'aclMenu2Name'
    );

    protected $initialProperties = array(
        'group_name' => 'aclGroupName',
        'group_alias' => 'aclGroupAlias',
        'contacts' => 'Guest',
        'contactgroups' => 'Supervisors',
        'status' => 1,
        'resources' => 'aclResource1Name',
        'menu' => 'aclMenu1Name',
        'actions' => 'aclAction1Name'
    );

    protected $updatedProperties = array(
        'group_name' => 'aclGroupNameChanged',
        'group_alias' => 'aclGroupAliasChanged',
        'contacts' => 'User',
        'contactgroups' => 'Guest',
        'status' => 1,
        'resources' => 'All Resources',
        'menu' => 'aclMenu2Name',
        'actions' => 'Simple User'
    );

    /**
     * @When one contact group exists including two non admin contacts
     */
    public function oneContactGroupExistsIncludingTwoNonAdminContacts()
    {
        $this->currentPage = new ContactGroupsConfigurationPage($this);
        $this->currentPage->setProperties($this->nonAdminContactGroup);
        $this->currentPage->save();
    }

    /**
     * @When the non admin access group is saved with its properties
     */
    public function theNonAdminAccessGroupIsSavedWithItsProperties()
    {
        $this->currentPage = new ACLGroupConfigurationPage($this);
        $this->currentPage->setProperties($this->aclGroupScenario1);
        $this->currentPage->save();
    }

    /**
     * @Then all linked users have the access list group displayed in Centreon authentication tab
     */
    public function allLinkedUsersHaveTheAccessListGroupDisplayedInCentreonAuthenticationTab()
    {
        $this->spin(
            function ($context) {
                $this->currentPage = new ContactGroupConfigurationListingPage($this);
                $this->currentPage = $this->currentPage->inspect($this->nonAdminContactGroup['name']);
                $object = $this->currentPage->getProperties();
                return $object['acl'] == $this->aclGroupScenario1['group_name'];
            },
            "The contact group is not linked with the acl group.",
            5
        );
    }

    /**
     * @When I add a new access group with linked contact group
     */
    public function iAddANewAccessGroupWithLinkedContactGroup()
    {
        $this->currentPage = new ContactConfigurationPage($this);
        $this->currentPage->setProperties($this->adminContact1);
        $this->currentPage->save();
        $this->currentPage = new ContactConfigurationPage($this);
        $this->currentPage->setProperties($this->adminContact2);
        $this->currentPage->save();
        $this->currentPage = new ContactGroupsConfigurationPage($this);
        $this->currentPage->setProperties($this->adminContactGroup);
        $this->currentPage->save();
    }

    /**
     * @When the admin access group is saved with its properties
     */
    public function theAdminAccessGroupIsSavedWithItsProperties()
    {
        $this->currentPage = new ACLGroupConfigurationPage($this);
        $this->currentPage->setProperties($this->aclGroupScenario2);
        $this->currentPage->save();
    }

    /**
     * @Then the Contact group has the access list group displayed in Relations informations
     */
    public function theContactGroupHasTheAccessListGroupDisplayedInRelationsInformations()
    {
        $this->spin(
            function ($context) {
                $this->currentPage = new ContactGroupConfigurationListingPage($this);
                $this->currentPage = $this->currentPage->inspect($this->adminContactGroup['name']);
                $object = $this->currentPage->getProperties();
                return $object['acl'] == $this->aclGroupScenario2['group_name'];
            },
            "The contact group is not linked with the acl group.",
            5
        );
    }

    /**
     * @Given one existing ACL access group
     */
    public function oneExistingAclAccessGroup()
    {
        $this->currentPage = new ACLResourceConfigurationPage($this);
        $this->currentPage->setProperties($this->aclResource1);
        $this->currentPage->save();
        $this->currentPage = new ACLActionConfigurationPage($this);
        $this->currentPage->setProperties($this->aclAction1);
        $this->currentPage->save();
        $this->currentPage = new ACLMenuConfigurationPage($this);
        $this->currentPage->setProperties($this->aclMenu1);
        $this->currentPage->save();
        $this->currentPage = new ACLMenuConfigurationPage($this);
        $this->currentPage->setProperties($this->aclMenu2);
        $this->currentPage->save();
        $this->currentPage = new ACLGroupConfigurationPage($this);
        $this->currentPage->setProperties($this->initialProperties);
        $this->currentPage->save();
    }

    /**
     * @When I modify its properties
     */
    public function iModifyItsProperties()
    {
        $this->currentPage = new ACLGroupConfigurationListingPage($this);
        $this->currentPage = $this->currentPage->inspect($this->initialProperties['group_name']);
        $this->currentPage->setProperties($this->updatedProperties);
        $this->currentPage->save();
    }

    /**
     * @Then all modified properties are updated
     */
    public function allModifiedPropertiesAreUpdated()
    {
        $this->tableau = array();
        try {
            $this->spin(
                function ($context) {
                    $this->currentPage = new ACLGroupConfigurationListingPage($this);
                    $this->currentPage = $this->currentPage->inspect($this->updatedProperties['group_name']);
                    $object = $this->currentPage->getProperties();
                    foreach ($this->updatedProperties as $key => $value) {
                        if ($value != $object[$key]) {
                            if (is_array($object[$key])) {
                                $value = array($value);
                            }
                            if ($value != $object[$key]) {
                                $this->tableau[] = $key;
                            }
                        }
                    }
                    return count($this->tableau) == 0;
                },
                "Some properties are not being updated : ",
                5
            );
        } catch (\Exception $e) {
            $this->tableau = array_unique($this->tableau);
            throw new \Exception("Some properties are not being updated : " . implode(',', $this->tableau));
        }
    }

    /**
     * @When I duplicate the access group
     */
    public function iDuplicateTheAccessGroup()
    {
        $this->currentPage = new ACLGroupConfigurationListingPage($this);
        $object = $this->currentPage->getEntry($this->initialProperties['group_name']);
        $this->currentPage->selectMoreAction($object, 'Duplicate');
    }

    /**
     * @Then a new access group appears with similar properties
     */
    public function aNewAccessGroupAppearsWithSimilarProperties()
    {
        $this->tableau = array();
        try {
            $this->spin(
                function ($context) {
                    $this->currentPage = new ACLGroupConfigurationListingPage($this);
                    $this->currentPage = $this->currentPage->inspect($this->initialProperties['group_name'] . '_1');
                    $object = $this->currentPage->getProperties();
                    foreach ($this->initialProperties as $key => $value) {
                        if ($key != 'group_name' && $value != $object[$key]) {
                            if (is_array($object[$key])) {
                                $value = array($value);
                            }
                            if ($value != $object[$key]) {
                                $this->tableau[] = $key;
                            }
                        }
                    }
                    return count($this->tableau) == 0;
                },
                "Some properties are not being updated : ",
                5
            );
        } catch (\Exception $e) {
            $this->tableau = array_unique($this->tableau);
            throw new \Exception("Some properties are not being updated : " . implode(',', $this->tableau));
        }
    }

    /**
     * @When I delete the access group
     */
    public function iDeleteTheAccessGroup()
    {
        $this->currentPage = new ACLGroupConfigurationListingPage($this);
        $object = $this->currentPage->getEntry($this->initialProperties['group_name']);
        $this->currentPage->selectMoreAction($object, 'Delete');
    }

    /**
     * @Then it does not exist anymore
     */
    public function itDoesNotExistAnymore()
    {
        $this->currentPage = new ACLGroupConfigurationListingPage($this);
        $objects = $this->currentPage->getEntries();
        if (key_exists($this->initialProperties['group_name'], $objects)) {
            throw new Exception($this->accessGroupsName . ' is still existing');
        }
    }

    /**
     * @Given one existing enabled ACL access group
     */
    public function oneExistingEnabledAclAccessGroup()
    {
        $this->currentPage = new ACLResourceConfigurationPage($this);
        $this->currentPage->setProperties($this->aclResource1);
        $this->currentPage->save();
        $this->currentPage = new ACLActionConfigurationPage($this);
        $this->currentPage->setProperties($this->aclAction1);
        $this->currentPage->save();
        $this->currentPage = new ACLMenuConfigurationPage($this);
        $this->currentPage->setProperties($this->aclMenu1);
        $this->currentPage->save();
        $this->currentPage = new ACLMenuConfigurationPage($this);
        $this->currentPage->setProperties($this->aclMenu2);
        $this->currentPage->save();
        $this->currentPage = new ACLGroupConfigurationPage($this);
        $this->currentPage->setProperties($this->initialProperties);
        $this->currentPage->save();
    }

    /**
     * @When I disable it
     */
    public function iDisableIt()
    {
        $this->currentPage = new ACLGroupConfigurationListingPage($this);
        $options = $this->getSession()->getPage()->findAll(
            'css',
            'table[class="ListTable"] tr'
        );
        foreach ($options as $element) {
            if ($this->assertFindIn($element, 'css', 'td:nth-child(2)')->getText() ==
                $this->initialProperties['group_name']
            ) {
                $this->assertFindIn($element, 'css', 'img[src="img/icons/disabled.png"]')->click();
            }
        }
    }

    /**
     * @Then its status is modified
     */
    public function itsStatusIsModified()
    {
        $this->currentPage = new ACLGroupConfigurationListingPage($this);
        $object = $this->currentPage->getEntry($this->initialProperties['group_name']);
        if ($object['status'] != 0) {
            throw new Exception($this->accessGroupsName . ' is still enabled');
        }
    }
}
