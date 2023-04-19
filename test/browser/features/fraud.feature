@mock-api:fraud-success @success
Feature: Happy path

  Viewing the Knowledge Based Verification questions successfully

  Background:
    Given Authenticatable Anita is using the system
    And they have provided their details

  @mock-api:fraud-success
  Scenario: Run fraud check
    Given they have started the Fraud journey
    And they can see the check page
    When they continue to fraud check
    Then they should be redirected as a success

  @mock-api:fraud-success-slow
  Scenario: Run fraud check
    Given they have started the Fraud journey
    And they can see the check page
    When they continue to fraud check
    Then they should be redirected as a success

  @mock-api:fraud-success-experian-links
  Scenario Outline: Run fraud check
    Given they have started the Fraud journey
    And they can see the check page
    And they click <page> and assert I have been directed correctly

    Examples:
      | page           |
      | ThirdParty     |
      | Privacy Policy |
