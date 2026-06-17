@QualityGateRegressionTest
@mock-api:fraud-session-error
Feature: Fraud CRI - Error handling - Session Error

  API Errors in middle of journey

  Background:
    Given Error Ethem has started the Fraud Journey

  @mock-api:fraud-session-error
  Scenario: API error - Sorry There is a Problem Error Page
    Then they should see an error page

  @mock-api:fraud-session-error
  Scenario: API error - Axe Accessibility Scan - Sorry There is a Problem Error Page
    Then they should see an error page
    And I run the Axe Accessibility check against the Fraud Error page
