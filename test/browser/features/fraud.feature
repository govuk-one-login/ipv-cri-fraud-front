@mock-api:fraud-success
Feature: Fraud CRI - Happy Path Tests

  Background:
    Given Authenticatable Anita has started the Fraud Journey
    And they have provided their details

  @mock-api:fraud-success
  Scenario: Fraud CRI - Run fraud check
    Given they can see the check page
    Then they can see the check page title text as We need to check your details
    Then they can see the check page title summary text first part as Your details will be checked against information held by another organisation.
    Then they can see the check page title summary text second part as This will help us protect you against online identity theft.
    Then they can see the check page warning text It can take up to 30 seconds to check your details. After you continue, do not reload or close this page.
    When they continue to fraud check
    Then they should be redirected as a success

  @mock-api:fraud-success-slow
  Scenario: Fraud CRI - Run fraud check - Slow Mode
    Given they can see the check page
    When they continue to fraud check
    Then they should be redirected as a success

  @mock-api:fraud-success-experian-links
  Scenario Outline: Fraud CRI - Who we check your details with Drop Down
    Given they can see the check page
    And they click <page> and assert I have been directed correctly
    Examples:
      | page           |
      | ThirdParty     |
      | Privacy Policy |

  @mock-api:fraud-success
  Scenario Outline: Fraud CRI - Footer Links
    Given they can see the check page
    And they click Footer <link> and assert I have been redirected correctly
    Examples:
      | link           |
      | Accessibility  |
      | Cookies        |
      | TsAndCs        |
      | Privacy        |
      | Support        |
      | OGL            |
      | CrownCopyright |

  @mock-api:fraud-success
  Scenario Outline: Fraud CRI - Beta Banner
    Given The Beta banner is displayed
    And they view the Beta banner with the text as This is a new service. Help us improve it and give your feedback (opens in a new tab).
    Then I assert the feedback URL <expectedPageUrl> is correct and live
    Examples:
      | expectedPageUrl                          |
      | https://signin.account.gov.uk/contact-us |

  @mock-api:fraud-success
  Scenario: Fraud CRI - Cookies Accept Analysis
    Given I select Accept analytics cookies button and see the text You've accepted additional cookies. You can change your cookie settings at any time.
    Then I select the accepted link change your cookie settings and assert I have been redirected correctly

  @mock-api:fraud-success
  Scenario: Fraud CRI - Cookies Reject Analysis
    Given I select Reject analytics cookies button and see the text You've rejected additional cookies. You can change your cookie settings at any time.
    Then I select the rejected link change your cookie settings and assert I have been redirected correctly

  @mock-api:fraud-success
  Scenario: Fraud CRI - Skip to Main Content
    Given they can see the check page
    Then I see the Skip to main content Link Text

  @mock-api:fraud-success
  Scenario: Fraud CRI - User Clicks the View Cookies on the Cookie Banner
    Given they can see the check page
    And The cookie banner is displayed
    When User clicks on the View Cookies Link
    And I check the Cookies page Title GOV.UK One Login cookies policy

 @mock-api:fraud-success
  Scenario: Fraud CRI - Cookies - Device Intelligence
    And they can see the check page
    Then I see the Device Intelligence Cookie <DeviceIntelligenceCookieName>
    Examples:
      | DeviceIntelligenceCookieName |
      | di-device-intelligence       |

  @mock-api:fraud-success
  Scenario: Fraud CRI - Axe Accessibility Scan - Fraud Check Page
    And they can see the check page
    And I run the Axe Accessibility check against the Fraud Check entry page
    When they continue to fraud check
    Then they should be redirected as a success
