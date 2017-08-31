Feature: Clapi
    As a Centreon admin
    I want to configure my centreon by command line
    To industrialize it

    Background:
        Given I am logged in a Centreon server

    Scenario: LDAP
        Given a ldap configuration
        When I export my ldap configuration and I delete it from centreon
        Then I can import this configuration
      #  Then a file is generated
      #  And I can import this configuration
      #  And my ldap configuration is imported
