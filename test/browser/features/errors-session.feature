@mock-api:fraud-session-error
Feature: Error handling

  API Errors in middle of journey

  Background:
    Given Error Ethem is using the system
    And they have provided their details

  @mock-api:fraud-session-error
  Scenario: API error
    Given they have started the Fraud journey
    Then they should see an error page
