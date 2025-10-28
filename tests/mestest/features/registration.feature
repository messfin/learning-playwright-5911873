Feature: FusionWW Registration

  Scenario: Complete registration form
    Given I am on the FusionWW home page
    When I open the registration modal
    And I click the registration modal title
    And I click Register Now
    And I fill the registration form with "John" "Doe" "john.doe@example.com" "password123"
    And I select the geographical region "Americas"
    Then the registration form should reflect the entered values
    And I close the registration modal




