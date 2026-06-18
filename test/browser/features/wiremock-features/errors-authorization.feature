@QualityGateRegressionTest
@mock-api:fraud-authorization-error
Feature: Fraud CRI - Error handling - Authorization Error

  API failure on the /authorization call after a successful identity check.

  Background:
    Given Error Ethem has started the Fraud Journey

  @mock-api:fraud-authorization-error
  Scenario: API error - OAuth error redirect when /authorization fails
    Given they can see the check page
    When they continue to fraud check
    Then they should be redirected as an error
