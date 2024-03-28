<<<<<<< HEAD
#@fraud_CRI
#Feature: Fraud CRI Language Test
#
#  Background: @Language-regression-fraud
#    Given I navigate to the IPV Core Stub
#    And I click the Fraud CRI for the testEnvironment
#    Then I search for user number 12 in the ThirdParty table
#    And I add a cookie to change the language to Welsh
#
#  #  To be removed after the test is moved to the front repo
#  @Language-regression-fraud
#  Scenario: Beta Banner Reject Analysis
#    When I view the Beta banner
#    When the beta banner reads Mae hwn yn wasanaeth newydd – bydd eich adborth (agor mewn tab newydd) yn ein helpu i'w wella.
#    And I select Gwrthod cwcis dadansoddi button
#    Then I see the Reject Analysis sentence Rydych wedi gwrthod cwcis ychwanegol. Gallwch newid eich gosodiadau cwcis unrhyw bryd.
#    And  I select the link newid eich gosodiadau cwcis
#    Then I check the page to change cookie preferences opens
#    And The test is complete and I close the driver
=======
@mock-api:fraud-success @newTest
Feature: Fraud CRI Language Test

  Background:
    Given Authenticatable Anita is using the system
    And they have provided their details
    And they have started the Fraud journey
    And they can see the check page
    And I add a cookie to change the language to Welsh

  #  To be removed after the test is moved to the front repo
  @mock-api:fraud-success @newTest
  Scenario: Beta Banner Reject Analysis
    When they view the Beta banner the correct Welsh text is present
    Then I select Gwrthod cwcis dadansoddi button
    Then I select the link change your cookie settings and assert I have been redirected correctly
>>>>>>> 7d0fe7d (LIME-429 initial commit)

