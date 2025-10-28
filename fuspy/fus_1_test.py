"""
FusionWW Header Navigation and Request Quote Flow Test (Python)
Equivalent to fus-1.spec.ts
"""
import pytest
from playwright.sync_api import expect
from fixtures.base_fixture import fusion_header, request_quote_page


def test_fusionww_header_nav_and_request_quote_flow(fusion_header, request_quote_page):
    """Test FusionWW header navigation and request quote flow using POM"""
    
    # Navigate to homepage and handle cookies
    fusion_header.goto()
    fusion_header.accept_cookies_if_present()

    # Test header navigation efficiently - only test key links
    key_header_links = [
        fusion_header.shop_link,
        fusion_header.industries_link,
        fusion_header.about_link,
    ]

    # Navigate through key header links with optimized waits
    for link in key_header_links:
        link.click()
        fusion_header.page.wait_for_load_state("domcontentloaded", timeout=2000)

    # Verify and click Request Quote button
    expect(fusion_header.request_quote_button).to_be_visible()
    fusion_header.request_quote_button.click()

    # Wait for request quote form to load with parallel expectations
    expect(request_quote_page.first_name).to_be_visible()
    expect(request_quote_page.email).to_be_visible()
    expect(request_quote_page.manufacturer_part_number).to_be_visible()

    # Test form field interactions efficiently - only test key fields
    key_form_fields = [
        request_quote_page.first_name,
        request_quote_page.email,
        request_quote_page.manufacturer_part_number,
    ]

    # Click key form fields to test focus
    for field in key_form_fields:
        field.click()

    # Test Sign In functionality
    request_quote_page.click_sign_in_safe()

    # Verify Sign In modal appeared
    access_your_account = request_quote_page.page.get_by_text("Access Your Account")
    expect(access_your_account.first).to_be_visible()

    # Close Sign In modal
    request_quote_page.close_modal_button.click()

    # Reopen Request Quote modal to test complete flow
    fusion_header.request_quote_button.click()

    # Wait for modal to be fully loaded
    expect(request_quote_page.first_name).to_be_visible()

    # Close the modal to complete the test
    request_quote_page.close_modal_button.click()


