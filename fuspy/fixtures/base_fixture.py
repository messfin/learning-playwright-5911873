"""
Base fixture for Playwright Python tests
"""
import pytest
from playwright.sync_api import sync_playwright, Browser, BrowserContext, Page
from pages.fusionww.header_page import FusionHeader
from pages.fusionww.request_quote_page import RequestQuotePage
from pages.fusionww.registration_page import RegistrationPage


@pytest.fixture(scope="session")
def browser():
    """Browser fixture for the entire test session"""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=1000)
        yield browser
        browser.close()


@pytest.fixture(scope="function")
def context(browser: Browser):
    """Browser context fixture for each test"""
    context = browser.new_context(
        viewport={"width": 1920, "height": 1080},
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    )
    yield context
    context.close()


@pytest.fixture(scope="function")
def page(context: BrowserContext):
    """Page fixture for each test"""
    page = context.new_page()
    yield page
    page.close()


@pytest.fixture(scope="function")
def fusion_header(page: Page):
    """FusionWW header page object fixture"""
    return FusionHeader(page)


@pytest.fixture(scope="function")
def request_quote_page(page: Page):
    """Request quote page object fixture"""
    return RequestQuotePage(page)


@pytest.fixture(scope="function")
def registration_page(page: Page):
    """Registration page object fixture"""
    return RegistrationPage(page)


