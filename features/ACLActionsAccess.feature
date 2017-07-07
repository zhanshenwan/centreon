Feature: ACL Actions Access
    As a Centreon administrator
    I want to administrate Actions Access
    To restrict users actions on Centreon objects
	
    Background:
        Given I am logged in a Centreon server
        And one ACL access groups including non admin users exists
        And one ACL access group including one admin user exists
                                
    Scenario: Creating Actions Access linked to one non admin access groups and to one admin access group
        When I add a new Actions access linked with the access groups
        Then the Actions access record is saved with its properties
        And all linked access group display the new Actions access in Authorized information tab
	
    Scenario: Creating Actions Access by selecting authorized actions one by one
        When I select one by one all actions to authorize them in a Actions access record I create
	Then all radio-buttons have to be checked.
	
    Scenario: Creating Actions Access by selecting authorized actions by lots
        When I check button-radio for a lot of actions
	Then all buttons-radio of the authorized actions lot are checked
            
    Scenario: Remove one access group from Actions access 
        Given one existing Actions access linked with one access group
        When I remove the access group
        Then link between access group and Actions access must be broken

    Scenario: Duplicate one existing Actions access record
        Given one existing Actions access
        When I duplicate the Actions access
        Then a new Actions access record is created with identical properties except the name
       
    Scenario: Modify one existing Actions access record
        Given one existing Actions access record
        When I modify some properties such as name, description, comments, status or auhtorized actions 
        Then the modifications are saved
        
    Scenario: Delete one existing Actions access record
        Given one existing Actions access
        When I delete the Actions access
        Then the Actions access record is not visible anymore in Actions Access page
