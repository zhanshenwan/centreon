    Feature: LDAP_authentication_disabled
        As a company administrator
        I want to import manually users
        In order to filter the ones who can access to Centreon Web
	
    Background:
        Given I am logged in a Centreon server
        And a LDAP configuration has been created 
        And "No" has been set to option Enable LDAP authentication 
        And "No" has been set to option Auto Import users

    Scenario: Search and import one user whose alias contains an accent
        When I search a specific user whose alias contains a special character such as an accent
        Then the LDAP search result displays the expected alias
        And the user is visible in Configuration > Users page
		
    Scenario: LDAP manually imported user can authenticate to Centreon Web
        Given one alias with an accent has been manually imported                              
        When this user logins to Centreon Web 
        Then he's logged by default on Home page
       
