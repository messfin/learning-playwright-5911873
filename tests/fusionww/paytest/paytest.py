from playwright.sync_api import sync_playwright

def test_open_google():
    try:
        with sync_playwright() as p:
            print("Launching browser...")
            browser = p.chromium.launch(headless=False)  # Set headless=True if you don't want browser UI
            # Open browserfus
            page = browser.new_page()
            
            # Open URL
            print("Navigating to Google...")
            page.goto("https://www.google.com")
            
            # Assert Title
            title = page.title()
            print(f"Page title: {title}")
            assert "Google" in title, f"Expected 'Google' in title, but got: {title}"
            print("SUCCESS: Test passed! Google page loaded successfully.")
            
            browser.close()
            print("Browser closed.")
    except Exception as e:
        print(f"ERROR: Test failed with error: {e}")
        raise

if __name__ == "__main__":
    test_open_google()