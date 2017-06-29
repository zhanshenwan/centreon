Feature: ACL Menus Access administration
    As a Centreon administrator
    I want to administrate Menus Access
    To give access to Centreon pages to users according their role in the company
	
    Background:
        Given I am logged in a Centreon server
        And three ACL access groups have been created
                     
    Scenario: Creating ACL Menus Access linked to several access groups
        When I add a new menus access linked with two groups
        Then the menu access is saved with its properties
        And only chosen linked access groups display the new menu access in Authorized information tab
		
    Scenario: Remove one access group from Menus access 
        Given one existing ACL Menus access linked with two access groups
        When I remove one access group
        Then link between access group and Menus access must be broken
       
    Scenario: Duplicate one existing Menus access
        Given one existing Menus access
        When I duplicate the Menus access
        Then a new Menus access is created with identical properties except the name

    Scenario: Disable one existing Menus access
        Given one existing enabled Menus access
        When I disable it
        Then its status is modified
        
    Scenario: Delete one existing Menus access
        Given one existing Menus access
        When I delete the Menus access
        Then the menus access record is not visible anymore in Menus Access page
        And the link with access groups is broken
