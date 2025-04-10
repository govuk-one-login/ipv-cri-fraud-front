@mock-api:fraud-session-error
Feature: Fraud CRI - Error handling - Session Error

  API Errors in middle of journey

  Background:
    Given Error Ethem is using the system
    And they have provided their details

  @mock-api:fraud-session-error
  Scenario: API error
    Given they have started the Fraud journey
    Then they should see an error page

  @mock-api:fraud-session-error
  Scenario: API error
    Given they have started the Fraud journey
    Then they should see an error page
    And I run the Axe Accessibility check against the Fraud Error page
