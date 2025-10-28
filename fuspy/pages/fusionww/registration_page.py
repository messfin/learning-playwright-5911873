"""
FusionWW Registration Page Object Model
"""
from playwright.sync_api import Page, Locator


class RegistrationPage:
    """FusionWW registration page object"""
    
    def __init__(self, page: Page):
        self.page = page
        self.account_button: Locator = page.locator("#account-button")
        self.register_button: Locator = page.get_by_role("button", name="Register")
        self.modal_title: Locator = page.locator(".Modal_titleWrapper__VtBVY > div")
        self.register_now_button: Locator = page.get_by_role("button", name="Register")
        self.first_name_input: Locator = page.get_by_role("textbox", name="First Name")
        self.last_name_input: Locator = page.get_by_role("textbox", name="Last Name")
        self.email_input: Locator = page.get_by_role("textbox", name="Email Address")
        self.geographical_region_button: Locator = page.get_by_role("button", name="Geographical Region")
        self.americas_option: Locator = page.get_by_role("option", name="Americas")
        self.password_input: Locator = page.get_by_role("textbox", name="Password", exact=True)
        self.confirm_password_input: Locator = page.get_by_role("textbox", name="Confirm Password")
        self.close_modal_button: Locator = page.get_by_role("button", name="Close modal")
        self.modal_container: Locator = page.locator('[role="dialog"], .modal, [class*="Modal"]').first

    def goto(self) -> None:
        """Navigate to FusionWW homepage"""
        self.page.goto("https://www.fusionww.com/")

    def dismiss_interfering_elements(self) -> None:
        """Remove any cookie banners or overlays that might interfere"""
        try:
            self.page.evaluate("""
                () => {
                    const interferingSelectors = [
                        "#hs-banner-parent",
                        ".hs-cookie-notification",
                        ".cookie-banner",
                        "#cookie-consent",
                        '[id*="cookie"]',
                        '[class*="cookie"]',
                        '[id*="banner"]',
                        '[class*="banner"]',
                    ];

                    interferingSelectors.forEach((selector) => {
                        const elements = document.querySelectorAll(selector);
                        elements.forEach((element) => {
                            if (element instanceof HTMLElement) {
                                element.style.display = "none";
                                element.style.visibility = "hidden";
                                element.style.pointerEvents = "none";
                                element.remove();
                            }
                        });
                    });
                }
            """)
        except Exception as e:
            print(f"Error dismissing interfering elements: {e}")

    def accept_cookies_if_present(self) -> None:
        """Accept cookies if present with comprehensive fallback strategies"""
        try:
            # Wait for page to load
            self.page.wait_for_load_state("domcontentloaded")
            self.page.wait_for_timeout(3000)

            # Try multiple cookie banner selectors
            cookie_selectors = [
                'button[data-testid="accept-all-cookies"]',
                'button:has-text("Accept all")',
                'button:has-text("Accept All")',
                'button:has-text("Accept")',
                '#hs-eu-cookie-confirmation-buttons-area button:has-text("Accept")',
                '.hs-cookie-notification-buttons button:has-text("Accept")',
                '#hs-eu-cookie-confirmation-buttons-area button[type="button"]',
                'button[data-hs-cookie-consent="accept-all"]',
                '[data-testid="cookie-banner"] button:has-text("Accept")',
                '.cookie-banner button:has-text("Accept")',
                '#cookie-consent button:has-text("Accept")',
            ]

            cookies_accepted = False

            for selector in cookie_selectors:
                try:
                    cookie_button = self.page.locator(selector).first
                    if cookie_button.is_visible(timeout=2000):
                        print(f"Found cookie button with selector: {selector}")
                        cookie_button.click()
                        self.page.wait_for_timeout(2000)

                        # Verify cookie banner is gone
                        cookie_banner = self.page.locator(
                            "#hs-banner-parent, .hs-cookie-notification, .cookie-banner, #cookie-consent"
                        )
                        if cookie_banner.is_visible(timeout=1000):
                            print("Cookie banner still visible, trying to dismiss again")
                            self.page.evaluate("""
                                () => {
                                    const banners = document.querySelectorAll(
                                        "#hs-banner-parent, .hs-cookie-notification, .cookie-banner, #cookie-consent"
                                    );
                                    banners.forEach((banner) => {
                                        if (banner instanceof HTMLElement) {
                                            banner.style.display = "none";
                                            banner.remove();
                                        }
                                    });
                                }
                            """)

                        cookies_accepted = True
                        print("Cookies accepted successfully")
                        break
                except Exception as e:
                    print(f"Selector {selector} failed: {e}")
                    continue

            if not cookies_accepted:
                print("No cookie banner found or could not be accepted")
                self.page.evaluate("""
                    () => {
                        const banners = document.querySelectorAll(
                            "#hs-banner-parent, .hs-cookie-notification, .cookie-banner, #cookie-consent"
                        );
                        banners.forEach((banner) => {
                            if (banner instanceof HTMLElement) {
                                banner.style.display = "none";
                                banner.remove();
                            }
                        });
                    }
                """)
        except Exception as e:
            print(f"Error in accept_cookies_if_present: {e}")

    def open_registration_modal(self) -> None:
        """Open the registration modal"""
        # Dismiss any interfering elements first
        self.dismiss_interfering_elements()

        # Wait for account button to be visible and clickable
        self.account_button.wait_for(state="visible", timeout=15000)
        self.account_button.click()

        # Wait for register button to be visible and clickable
        self.register_button.wait_for(state="visible", timeout=15000)
        self.register_button.click()

        # Wait for modal to be fully loaded
        self.page.wait_for_timeout(2000)

        # Wait for modal container to be visible
        self.modal_container.wait_for(state="visible", timeout=10000)

    def click_modal_title(self) -> None:
        """Click the modal title"""
        self.modal_title.click()

    def click_register_now(self) -> None:
        """Click the Register Now button"""
        # Dismiss any interfering elements first
        self.dismiss_interfering_elements()

        # Wait for register button to be visible and enabled
        self.register_now_button.wait_for(state="visible", timeout=15000)

        # Wait for the button to be enabled
        self.register_now_button.wait_for(state="attached")
        self.page.wait_for_function(
            "() => { const button = document.querySelector('button[disabled]'); return !button || !button.hasAttribute('disabled'); }",
            timeout=15000
        )

        self.register_now_button.click()

        # Wait for form to be fully loaded
        self.page.wait_for_timeout(2000)

        # Wait for form inputs to be visible
        self.first_name_input.wait_for(state="visible", timeout=10000)

    def fill_first_name(self, first_name: str) -> None:
        """Fill the first name field"""
        self.first_name_input.wait_for(state="visible")
        self.first_name_input.click()
        self.first_name_input.fill(first_name)

    def fill_last_name(self, last_name: str) -> None:
        """Fill the last name field"""
        self.last_name_input.wait_for(state="visible")
        self.last_name_input.click()
        self.last_name_input.fill(last_name)

    def fill_email(self, email: str) -> None:
        """Fill the email field"""
        self.email_input.wait_for(state="visible")
        self.email_input.click()
        self.email_input.fill(email)

    def select_geographical_region(self, region: str = "Americas") -> None:
        """Select geographical region"""
        self.geographical_region_button.wait_for(state="visible")
        self.geographical_region_button.click()

        # Wait for dropdown to open and select the specified region
        region_option = self.page.get_by_role("option", name=region)
        region_option.wait_for(state="visible")
        region_option.click()

    def fill_password(self, password: str) -> None:
        """Fill the password field"""
        self.password_input.wait_for(state="visible")
        self.password_input.click()
        self.password_input.fill(password)

    def fill_confirm_password(self, password: str) -> None:
        """Fill the confirm password field"""
        self.confirm_password_input.wait_for(state="visible")
        self.confirm_password_input.click()
        self.confirm_password_input.fill(password)

    def close_modal(self) -> None:
        """Close the modal"""
        self.close_modal_button.click()

    def close_modal_twice(self) -> None:
        """Close the modal with multiple fallback strategies"""
        try:
            # Try multiple close button selectors
            close_modal_selectors = [
                'button[aria-label="Close modal"]',
                'button:has-text("Close modal")',
                ".Modal_icon__v9JkP",
                '[data-testid="close-modal"]',
                'button[class*="close"]',
                'button[class*="Close"]',
                'button[aria-label="close"]',
                'button[title="Close"]',
                'button[title="close"]',
                '[role="button"][aria-label*="close" i]',
                '[role="button"][aria-label*="Close" i]',
                'button:has([class*="close"])',
                'button:has([class*="Close"])',
                "button:has(svg)",
                ".Modal_closeButton__*",
                ".close-button",
                ".closeButton",
                ".modal-close",
                ".modalClose",
            ]

            modal_closed = False

            # First attempt - try all selectors
            for selector in close_modal_selectors:
                try:
                    close_button = self.page.locator(selector).first
                    if close_button.is_visible(timeout=1000):
                        close_button.click()
                        print(f"Modal closed using selector: {selector}")
                        modal_closed = True
                        break
                except:
                    continue

            # Wait for modal to start closing
            self.page.wait_for_timeout(1000)

            # Second attempt - try again with different selectors
            if not modal_closed:
                second_attempt_selectors = [
                    'button[aria-label="Close modal"]',
                    'button:has-text("Close modal")',
                    ".Modal_icon__v9JkP",
                    'button[class*="close"]',
                    'button[class*="Close"]',
                ]

                for selector in second_attempt_selectors:
                    try:
                        close_button = self.page.locator(selector).first
                        if close_button.is_visible(timeout=1000):
                            close_button.click()
                            print(f"Modal closed on second attempt using selector: {selector}")
                            modal_closed = True
                            break
                    except:
                        continue

            # If still not closed, try pressing Escape key
            if not modal_closed:
                print("Trying Escape key to close modal")
                self.page.keyboard.press("Escape")
                self.page.wait_for_timeout(1000)

            # Final attempt - try clicking outside the modal
            if not modal_closed:
                print("Trying to click outside modal to close it")
                self.page.click("body", position={"x": 10, "y": 10})
                self.page.wait_for_timeout(1000)
        except Exception as e:
            print(f"Error in close_modal_twice: {e}")
            # Try pressing Escape key as fallback
            self.page.keyboard.press("Escape")

    def wait_for_modal_to_close(self) -> None:
        """Wait for modal to close"""
        try:
            # Wait for modal container to disappear
            self.modal_container.wait_for(state="detached", timeout=10000)
        except Exception as e:
            print(f"Modal container not found or already closed: {e}")


