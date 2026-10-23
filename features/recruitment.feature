Feature: LHH Recruitment Solutions

  @page-load
  Scenario: Recruitment page opens successfully
    Given I open the LHH recruitment solutions page
    Then the page should load successfully

  @page-title
  Scenario: Page has a title
    Given I open the LHH recruitment solutions page
    Then the page title should not be empty

  @recruitment-content
  Scenario: Recruitment solutions content is displayed
    Given I open the LHH recruitment solutions page
    Then the recruitment page should contain visible content

  @navigation-links
  Scenario: Navigation links have valid destinations
    Given I open the LHH recruitment solutions page
    Then the page should contain valid navigation destinations