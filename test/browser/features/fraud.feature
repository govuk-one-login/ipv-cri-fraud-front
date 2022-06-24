@mock-api:fraud-success @success
Feature: Happy path

  Viewing the Knowledge Based Verification questions successfully

  Background:
    Given Authenticatable Anita is using the system
    And they have provided their details

  Scenario: Run fraud check
    Given they have started the Fraud journey
    And they can see the check page
    When they continue to fraud check
    Then they should be redirected as a success
