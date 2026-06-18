@QualityGateRegressionTest
@mock-api:fraud-success
Feature: Fraud CRI - Journey Resilience

  Guards against regressions in session persistence and the outbound request from the check controller

  Background:
    Given Authenticatable Anita has started the Fraud Journey

  @mock-api:fraud-success
  Scenario: Session survives a page reload on the check page
    Given they can see the check page
    When they reload the check page
    Then they can see the check page
    When they continue to fraud check
    Then they should be redirected as a success

  @mock-api:fraud-success
  Scenario: The identity-check request carries the session_id header
    Given they can see the check page
    When they continue to fraud check
    Then they should be redirected as a success
    And the backend received the identity-check request with the session_id header

  @mock-api:fraud-success
  Scenario: The identity-check request carries the txma-audit-encoded header
    Given they can see the check page
    When they continue to fraud check
    Then they should be redirected as a success
    And the backend received the identity-check request with the txma-audit-encoded header
