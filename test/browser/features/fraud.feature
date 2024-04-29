@mock-api:fraud-success
Feature: Happy path

  Background:
    Given Authenticatable Anita is using the system
    And they have provided their details

  @mock-api:fraud-success
  Scenario: Run fraud check
    Given they have started the Fraud journey
    And they can see the check page
    Then they see the reloading page warning text as It can take up to 30 seconds to check your details. After you continue, do not reload or close this page.
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

  @mock-api:fraud-success
  Scenario: Beta Banner Reject Analysis
    Given they have started the Fraud journey
    When they view the Beta banner with the text as This is a new service – your feedback (opens in new tab) will help us to improve it.
    Then I select Reject analytics cookies button and see the text You've rejected additional cookies. You can change your cookie settings at any time.
    Then I select the link change your cookie settings and assert I have been redirected correctly
