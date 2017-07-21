Feature: ACL Remove Resources acess for an ACL access group
    As a Centreon administrator
    I want to administrate ACL access groups
    To give access to Centreon pages to users according their role in the company
    
    Background:
        Given I am logged in a Centreon server
        And an ACL access group exists
        And the ACL access group is linked to an existing Resources access record
        
    Scenario: Break link between Resources Access and Access group in Admin > ACL > Access Groups page
        When one resources access record is removed in tab Authorized information of Administration > ACL > Access Groups page
        Then the resources access record is saved in Available records list
        
    Scenario: Break link between Resources Access and Access group in Admin > ACL > Resources Access page
        When one Access group record is removed in tab General information of Administration > ACL > Resources Access page
        Then the Access group record is saved in Available Linked Groups list
