@stub-test
Feature: Fraud CRI - IPV Core Stub - Happy Path Tests

  Background:
    Given I navigate to the IPV Core Stub
    And I click the Fraud CRI for the testEnvironment

  @stub-test
  Scenario Outline: Fraud CRI - IPV Core Stub - Happy Path - Run Fraud check by userId <expectedGivenName> <expectedFamilyName>
    Given I search for user number <userId> in the ThirdParty table
    Then User is navigated to the Fraud <page> Page
    Then User clicks the fraud continue button
    Then User is navigated to the Verifiable Credential Issuers Page
    Then The VC contains the expected response for <expectedGivenName> <expectedFamilyName> with <expectedIdentityFraudScoreMasked> and <expectedCiMasked>
    Examples:
      | userId | page  | expectedGivenName | expectedFamilyName | expectedIdentityFraudScoreMasked | expectedCiMasked |
      | 197    | check | KENNETH           | DECERQUEIRA        | MASKED                           | MASKED           |

  @stub-test
  Scenario Outline: Fraud CRI - IPV Core Stub - Happy Path - Run Fraud check by user search <expectedGivenName> <expectedFamilyName>
    Given I search for user name <userName> in the ThirdParty table
    When User clicks the Go to Fraud CRI button
    Then User is navigated to the Fraud <page> Page
    Then User clicks the fraud continue button
    Then User is navigated to the Verifiable Credential Issuers Page
    Then The VC contains the expected response for <expectedGivenName> <expectedFamilyName> with <expectedIdentityFraudScoreMasked> and <expectedCiMasked>
    Examples:
      | userName   | page  | expectedGivenName | expectedFamilyName | expectedIdentityFraudScoreMasked | expectedCiMasked |
      | LINDA DUFF | check | LINDA             | DUFF               | MASKED                           | MASKED           |

  @stub-test
  Scenario Outline: Fraud CRI - IPV Core Stub - Happy Path - PEPs and RCA Users - Run Fraud check by edit user <expectedGivenName> <expectedFamilyName>
    Given I search for user name <userName> in the ThirdParty table
    When User clicks Edit User button
    When I update the user details with given name <givenName>, family name <familyName>
    When User clicks the Go to Fraud CRI button
    Then User is navigated to the Fraud <page> Page
    Then User clicks the fraud continue button
    Then User is navigated to the Verifiable Credential Issuers Page
    Then The VC contains the expected response for <expectedGivenName> <expectedFamilyName> with <expectedIdentityFraudScoreMasked> and <expectedCiMasked>
    Examples:
      | userName            | givenName | familyName                       | page  | expectedGivenName | expectedFamilyName               | expectedIdentityFraudScoreMasked | expectedCiMasked |
      | KENNETH DECERQUEIRA | KENNETH   | WATCHLIST_PEP_UK_STANDARD        | check | KENNETH           | WATCHLIST_PEP_UK_STANDARD        | MASKED                           | MASKED           |
      | KENNETH DECERQUEIRA | KENNETH   | WATCHLIST_PEP_UK_SAME_DOB        | check | KENNETH           | WATCHLIST_PEP_UK_SAME_DOB        | MASKED                           | MASKED           |
      | KENNETH DECERQUEIRA | KENNETH   | WATCHLIST_PEP_ISLEOM_SIMILAR_DOB | check | KENNETH           | WATCHLIST_PEP_ISLEOM_SIMILAR_DOB | MASKED                           | MASKED           |
      | KENNETH DECERQUEIRA | KENNETH   | WATCHLIST_PEP_FALK_SAME_DOB      | check | KENNETH           | WATCHLIST_PEP_FALK_SAME_DOB      | MASKED                           | MASKED           |
      | KENNETH DECERQUEIRA | KENNETH   | WATCHLIST_RCA_UK_SAME_DOB        | check | KENNETH           | WATCHLIST_RCA_UK_SAME_DOB        | MASKED                           | MASKED           |
      | KENNETH DECERQUEIRA | KENNETH   | WATCHLIST_RCA_GUERN_SAME_DOB     | check | KENNETH           | WATCHLIST_RCA_GUERN_SAME_DOB     | MASKED                           | MASKED           |
      | KENNETH DECERQUEIRA | KENNETH   | WATCHLIST_RCA_BERM_SIMILAR_DOB   | check | KENNETH           | WATCHLIST_RCA_BERM_SIMILAR_DOB   | MASKED                           | MASKED           |
