Feature: LHH Luxembourg header dropdown navigation
  As a visitor to the LHH website
  I want to open each header dropdown and follow its links
  So that I can navigate to the correct pages

  Background:
    Given I open the LHH Insights page

  Scenario Outline: Each header dropdown opens
    When I click the "<heading>" dropdown button
    Then the dropdown menu should display links

    Examples:
      | heading       |
      | Job Seekers   |
      | Organisations |
      | Executives    |
      | Insights      |
      | About         |
@jobseekers
  Scenario Outline: Job Seekers menu link navigates to its destination
    When I click the "Job Seekers" dropdown button
    And I select the "<link>" menu link
    Then the browser URL should be the expected destination for "<link>"

    Examples:
      | link                              |
      | For Job Seekers                    |
     | Search Open Jobs                   |
      | Submit CV                          |
     | Start Your Outplacement Programme  |
    | Upskill your capabilities          |
