@QualityGateRegressionTest
@mock-api:fraud-check-error
Feature: Fraud CRI - Error handling - Check Error

  API Errors in middle of journey

  Background:
    Given Error Ethem has started the Fraud Journey
    And they have provided their details

  @mock-api:fraud-check-error
  Scenario: API error
    Given they can see the check page
    When they continue to fraud check
    Then they should be redirected as an error
