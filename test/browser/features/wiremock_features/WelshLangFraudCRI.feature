@QualityGateRegressionTest @QualityGateIntegrationTest
@mock-api:fraud-success
Feature: Fraud CRI - Welsh Language Test

  Background:
    Given Authenticatable Anita has started the Fraud Journey
    And they have provided their details
    And they can see the check page
    And I add a cookie to change the language to Welsh

  @mock-api:fraud-success
  Scenario: Fraud CRI - Run fraud check
    Given they can see the check page title text as Rydym angen gwirio eich manylion
    Then they can see the check page title summary text first part as Bydd eich manylion yn cael eu gwirio yn erbyn gwybodaeth sy'n cael ei ddal gan sefydliad arall.
    Then they can see the check page title summary text second part as Bydd hyn yn ein helpu i'ch amddiffyn rhag dwyn hunaniaeth ar-lein.
    Then they can see the check page warning text Gall gymryd hyd at 30 eiliad i wirio'ch manylion. Ar ôl i chi barhau, peidiwch ag ail-lwytho neu gau'r dudalen hon.
    When they continue to fraud check page
    Then they should be redirected as a success

  @mock-api:fraud-success
  Scenario: Fraud CRI - Beta Banner Accept Analysis
    Given they view the Beta banner with the Welsh text as Mae hwn yn wasanaeth newydd. Helpwch ni i'w wella a rhoi eich adborth (agor mewn tab newydd).
    Then I select Accept analytics cookies button and see the text Rydych wedi derbyn cwcis ychwanegol. Gallwch newid eich gosodiadau cwcis ar unrhyw adeg.
    Then I select the accepted link change your cookie settings and assert I have been redirected correctly

  @mock-api:fraud-success
  Scenario: Fraud CRI - Beta Banner Reject Analysis
    When they view the Beta banner with the Welsh text as Mae hwn yn wasanaeth newydd. Helpwch ni i'w wella a rhoi eich adborth (agor mewn tab newydd).
    Then I select Reject analytics cookies button and see the text Rydych wedi gwrthod cwcis ychwanegol. Gallwch newid eich gosodiadau cwcis ar unrhyw adeg.
    Then I select the rejected link change your cookie settings and assert I have been redirected correctly
