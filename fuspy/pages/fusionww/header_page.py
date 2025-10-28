"""
FusionWW Header Page Object Model
"""
from playwright.sync_api import Page, Locator


class FusionHeader:
    """FusionWW header page object"""
    
    def __init__(self, page: Page):
        self.page = page
        self.accept_all_button: Locator = page.get_by_role("button", name="Accept all")
        self.shop_link: Locator = page.get_by_role("link", name="Shop", exact=True)
        self.industries_link: Locator = page.get_by_text("Industries", exact=True)
        self.quality_link: Locator = page.get_by_text("Quality", exact=True)
        self.about_link: Locator = page.get_by_text("About", exact=True)
        self.insights_link: Locator = page.get_by_role("link", name="Insights")
        self.request_quote_button: Locator = (
            page.locator("#global-header")
            .get_by_role("button", name="Request Quote")
        )

    def goto(self) -> None:
        """Navigate to FusionWW homepage"""
        self.page.goto("https://www.fusionww.com/")

    def accept_cookies_if_present(self) -> None:
        """Accept cookies if the banner is present"""
        try:
            if self.accept_all_button.is_visible(timeout=3000):
                self.accept_all_button.click()
                # Wait for cookie banner to disappear
                try:
                    self.accept_all_button.wait_for(state="hidden", timeout=2000)
                except:
                    pass
        except Exception:
            print("Cookie banner not found or already dismissed")


