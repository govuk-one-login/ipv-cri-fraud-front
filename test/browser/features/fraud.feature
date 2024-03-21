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
    Then they see the text to warn against reloading the page
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

  @mock-api:fraud-success
  Scenario Outline: Check support links
    Given they have started the Fraud journey
    And they can see the check page
    And they click Footer <link> and assert I have been redirected correctly

    Examples:
      | link           |
      | Support        |

#  @happy_path @build-fraud @staging-fraud @integration-fraud
#  Scenario: Beta Banner Reject Analysis
#    Given I navigate to the IPV Core Stub
#    And I click the Fraud CRI for the testEnvironment
#    Then I search for user number 12 in the ThirdParty table
#    When I view the Beta banner
#    When the beta banner reads This is a new service – your feedback (opens in new tab) will help us to improve it.
#    And I select Reject analytics cookies button
#    Then I see the Reject Analysis sentence You've rejected additional cookies. You can change your cookie settings at any time.
#    Then  I select the link change your cookie settings
#    Then I check the page to change cookie preferences opens
#    And The test is complete and I close the driver
