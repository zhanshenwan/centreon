Feature: Free Plugin Packs Installation
    As a Centreon user
    I want to install all free plugin packs offered by Centreon
    In order to configure quickly host and services

    Background:
        Given I am logged in a Centreon server
        And required extensions have been installed 
            
    Scenario: Install enabled free plugin packs
        When I install the free plugins packs
        Then all corresponding objects such as host templates, services templates, commands are added in Centreon
