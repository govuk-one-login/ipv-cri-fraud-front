@mock-api:fraud-success
Feature: Fraud CRI Language Test

  Background:
    Given Authenticatable Anita is using the system
    And they have provided their details
    And they have started the Fraud journey
    And they can see the check page
    And I add a cookie to change the language to Welsh

  @mock-api:fraud-success
  Scenario: Beta Banner Reject Analysis
    When they view the Beta banner the correct Welsh text is present
    Then I select Gwrthod cwcis dadansoddi button
    Then I select the link change your cookie settings and assert I have been redirected correctly

