Feature:  Top Counter Status Filters
    As a Centreon admin or non admin user
    I want to check quickly hosts or services number for each status and display hosts or services filtered by status
    So that I have a general idea of the state of the monitored IT system in a glance
    	
    Background:
        Given I am logged in a Centreon server
        And 3 hosts with 2 services by host have been configured
        And one host is linked to host groups 1 and 2
        And one host is linked only to host group 1
        And one host is not linked to any host groups
        And one service is linked to services groups 1 and 2
        And one service is not linked to any service group
        And one existing admin user and one existing non admin user are both linked to ACL access group 1 and 2
        And one ACL Resources Access record is linked to ACL access groups 1 and 2, and to host groups 1 and 2
        And one ACL Resources Access record is linked to ACL access groups 1 and 2, and to services groups 1 and 2
      
    Scenario: Hosts filtered by status in Top Counter for admin user
        When admin user clicks on each host status of the Top Counter
        Then list of hosts filtered by status is displayed 
        And the number of records is exactly the same than in the top counter
        And admin user can see host not linked to any host group

    Scenario: Services filtered by status in Top Counter for admin user
        When admin user clicks on each service status of the Top Counter
        Then list of services filtered by status is displayed 
        And the number of records is exactly the same than in the top counter
        And admin user can see service not linked to any service group

    Scenario: Hosts filtered by status in Top Counter for non admin user
        When non admin user clicks on each host status of the Top Counter
        Then list of hosts filtered by status is displayed 
        And the number of records is exactly the same than in the top counter
        And non admin user cannot see host not linked to any host group

    Scenario:  Hosts filtered by status in Top Counter for non admin user
        When non admin user clicks on each service status of the Top Counter
        Then list of services filtered by status is displayed 
        And the number of records is exactly the same than in the top counter
        And non admin user cannot see service not linked to any service group

