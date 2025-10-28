"""
FusionWW Request Quote Page Object Model
"""
from playwright.sync_api import Page, Locator


class RequestQuotePage:
    """FusionWW request quote page object"""
    
    def __init__(self, page: Page):
        self.page = page
        self.accept_all_button: Locator = page.get_by_role("button", name="Accept all")
        self.first_name: Locator = page.get_by_role("textbox", name="First Name")
        self.last_name: Locator = page.get_by_role("textbox", name="Last Name")
        self.email: Locator = page.get_by_role("textbox", name="Email")
        self.phone_number: Locator = page.get_by_role("textbox", name="Phone Number")
        self.company_name: Locator = page.get_by_role("textbox", name="Company Name")
        self.geographic_region: Locator = page.get_by_role("button", name="Geographic Region")
        self.manufacturer_part_number: Locator = page.get_by_role("textbox", name="Manufacturer Part Number")
        self.comments: Locator = page.get_by_role("textbox", name="Add Comments (Optional)")
        self.sign_in_button: Locator = page.get_by_role("button", name="Sign In")
        self.close_modal_button: Locator = page.get_by_role("button", name="Close modal")

    def accept_cookies_if_present(self) -> None:
        """Accept cookies if present with multiple fallback strategies"""
        candidates = [
            self.accept_all_button,
            self.page.get_by_role("button", name="Accept All Cookies"),
            self.page.get_by_role("button", name="Accept Cookies"),
            self.page.locator("#hs-eu-confirmation-button"),
            self.page.locator("#onetrust-accept-btn-handler"),
        ]

        for locator in candidates:
            try:
                if locator.is_visible(timeout=500):
                    locator.click(trial=False)
                    break
            except:
                continue

        # Wait briefly for the banner container to be gone
        banner = self.page.locator("#hs-banner-parent")
        try:
            banner.wait_for(state="hidden", timeout=2000)
        except:
            pass

    def wait_for_iframe_content(self, iframe_selector: str, timeout: int = 5000) -> bool:
        """Wait for iframe content to load"""
        try:
            # Wait for iframe to be attached to DOM
            self.page.wait_for_selector(iframe_selector, timeout=2000)

            # Wait for iframe to load
            iframe = self.page.frame_locator(iframe_selector)

            # Wait for any content to be visible in the iframe
            iframe.locator("body").wait_for(state="visible", timeout=timeout)

            # Additional wait for dynamic content
            self.page.wait_for_timeout(500)

            return True
        except:
            return False

    def click_sign_in_safe(self) -> None:
        """Safely click the Sign In button with multiple fallback strategies"""
        self.accept_cookies_if_present()

        # Optimized approach: try the most likely candidates first
        page_candidates = [
            self.sign_in_button,
            self.page.get_by_text("Sign In"),
            self.page.locator('button:has-text("Sign In")'),
        ]

        # Quick scroll to ensure elements are in view
        self.page.evaluate("() => window.scrollTo(0, 0)")
        self.page.wait_for_timeout(100)

        # Try primary candidates
        for locator in page_candidates:
            try:
                if locator.is_visible(timeout=1000):
                    locator.scroll_into_view_if_needed()
                    locator.click(timeout=2000)
                    return
            except:
                continue

        # Try modal containers
        modal_roots = [
            self.page.get_by_role("dialog"),
            self.page.locator('[aria-modal="true"]'),
        ]

        for modal in modal_roots:
            try:
                if modal.is_visible(timeout=500):
                    modal_btn = modal.get_by_role("button", name="Sign In").first
                    if modal_btn.is_visible(timeout=500):
                        modal_btn.click(timeout=2000)
                        return
            except:
                continue

        # Try iframe contexts
        iframe_candidates = [
            'iframe[src*="hubspot"]',
            'iframe[src*="hsforms"]',
            'iframe[src*="hs-scripts"]',
            'iframe[title*="chat"]',
            'iframe[title*="widget"]',
            'iframe[title*="form"]',
            "iframe[data-hs-iframe]",
            'iframe[class*="hs-form"]',
            'iframe[class*="chat"]',
            'iframe[class*="widget"]',
            'iframe[src*="//"]',
            'iframe:not([src=""])',
        ]

        for iframe_selector in iframe_candidates:
            try:
                iframe_ready = self.wait_for_iframe_content(iframe_selector, 3000)
                if not iframe_ready:
                    continue

                iframe = self.page.frame_locator(iframe_selector)
                sign_in_in_iframe = iframe.get_by_role("button", name="Sign In")

                if sign_in_in_iframe.is_visible(timeout=1000):
                    sign_in_in_iframe.click(timeout=2000)
                    return
            except:
                continue

        # Try iframe with text-based locators
        for iframe_selector in iframe_candidates:
            try:
                iframe_ready = self.wait_for_iframe_content(iframe_selector, 2000)
                if not iframe_ready:
                    continue

                iframe = self.page.frame_locator(iframe_selector)
                sign_in_text_in_iframe = iframe.get_by_text("Sign In")

                if sign_in_text_in_iframe.is_visible(timeout=1000):
                    sign_in_text_in_iframe.click(timeout=2000)
                    return
            except:
                continue

        # Try iframe with generic button locators
        for iframe_selector in iframe_candidates:
            try:
                iframe_ready = self.wait_for_iframe_content(iframe_selector, 2000)
                if not iframe_ready:
                    continue

                iframe = self.page.frame_locator(iframe_selector)
                sign_in_button_in_iframe = iframe.locator('button, [role="button"]').filter(has_text="Sign In")

                if sign_in_button_in_iframe.count() > 0:
                    sign_in_button_in_iframe.first.click(timeout=2000)
                    return
            except:
                continue

        # Fallback: try any button with Sign In text
        try:
            sign_in_buttons = self.page.locator('button, [role="button"]').filter(has_text="Sign In")
            if sign_in_buttons.count() > 0:
                sign_in_buttons.first.click(timeout=2000)
                return
        except:
            pass

        print("Sign In button not found in page, modals, or iframes, continuing with test")


