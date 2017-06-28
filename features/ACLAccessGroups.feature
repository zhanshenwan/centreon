Feature: ACL Access Groups
    As a Centreon administrator
    I want to administrate ACL access groups
    To give access to Centreon pages to users according their role in the company
	
    Background:
        Given I am logged in a Centreon server
        And two non admin contacts exist
        And one contact group including those non admin contacts exists
        
    Scenario: Creating ACL access group with linked contacts
        When I add a new access group with linked contacts
        Then the access group is saved with its properties
        And all linked users have the access list group displayed in Centreon authentication tab
		
    Scenario: Creating ACL access group with linked contact group
        When I add a new access group with linked contact group
        Then the access group is saved with its properties
        And the Contact group has the access list group displayed in Centreon authentication tab

    Scenario: Modify ACL access group properties
        Given one existing ACL access group
        When I modify its properties
        Then all modified properties are updated
        
    Scenario: Duplicate ACL access group 
        Given one existing ACL access group
        When I duplicate the access group
        Then a new access group appears with similar properties
       
    Scenario: Delete ACL access group 
        Given one existing ACL access group
        When I duplicate the access group
        Then a new access group appears with similar properties

    Scenario: Disable ACL access group 
        Given one existing enabled ACL access group
        When I disable it
        Then its status is modified
        
