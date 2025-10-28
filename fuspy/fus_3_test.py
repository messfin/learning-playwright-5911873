"""
FusionWW Registration Flow Test (Python)
Equivalent to fus-3.spec.ts
"""
import pytest
from playwright.sync_api import expect
from fixtures.base_fixture import registration_page


@pytest.mark.timeout(90)
def test_fusionww_registration_flow_detailed(registration_page):
    """Test FusionWW registration flow with detailed BDD-style steps"""
    
    # Given: I am on the FusionWW home page
    registration_page.goto()
    expect(registration_page.page).to_have_url("https://www.fusionww.com/")

    # Accept cookies if present
    registration_page.accept_cookies_if_present()
    registration_page.page.wait_for_load_state("domcontentloaded")

    # When: I open the registration modal
    registration_page.open_registration_modal()

    # Verify modal opened successfully
    expect(registration_page.account_button).to_be_visible(timeout=10000)
    expect(registration_page.register_button).to_be_visible(timeout=10000)

    # When: I click the registration modal title
    registration_page.click_modal_title()
    expect(registration_page.modal_title).to_be_visible(timeout=10000)

    # When: I click Register Now
    registration_page.click_register_now()
    expect(registration_page.register_now_button).to_be_visible(timeout=10000)

    # When: I fill the registration form with John Doe john.doe@example.com password123
    registration_page.fill_first_name("John")
    expect(registration_page.first_name_input).to_have_value("John")

    registration_page.fill_last_name("Doe")
    expect(registration_page.last_name_input).to_have_value("Doe")

    registration_page.fill_email("john.doe@example.com")
    expect(registration_page.email_input).to_have_value("john.doe@example.com")

    registration_page.fill_password("password123")
    expect(registration_page.password_input).to_have_value("password123")

    registration_page.fill_confirm_password("password123")
    expect(registration_page.confirm_password_input).to_have_value("password123")

    # When: I select the geographical region Americas
    registration_page.select_geographical_region("Americas")
    expect(registration_page.geographical_region_button).to_be_visible(timeout=10000)

    # Then: the registration form should reflect the entered values
    inputs = [
        registration_page.first_name_input,
        registration_page.last_name_input,
        registration_page.email_input,
        registration_page.password_input,
        registration_page.confirm_password_input,
    ]

    for input_field in inputs:
        expect(input_field).to_be_visible(timeout=10000)
        expect(input_field).not_to_be_empty()

    # Then: I close the registration modal
    registration_page.close_modal_twice()

    # Wait for modal to close and verify it's no longer visible
    registration_page.page.wait_for_timeout(2000)
    expect(registration_page.modal_title).not_to_be_visible(timeout=10000)


