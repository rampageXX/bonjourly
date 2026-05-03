"""Debug: check JS state on journey screen."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

APP_PATH = Path(__file__).parent / "index.html"
BASE_URL  = APP_PATH.as_uri()

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    errors = []
    page.on("console", lambda m: errors.append(f"[{m.type}] {m.text}") if m.type in ("error","warning") else None)
    page.on("pageerror", lambda e: errors.append(f"[pageerror] {e}"))

    page.goto(BASE_URL, wait_until="domcontentloaded")
    page.wait_for_timeout(600)

    # Login
    page.fill("#name-input", "TestUser")
    page.click("button:has-text('Commencer')")
    page.wait_for_timeout(2000)

    print("currentPlayer:", page.evaluate("JSON.stringify(window.currentPlayer)"))
    print("REGIONS defined:", page.evaluate("typeof REGIONS !== 'undefined' && REGIONS.length"))
    print("renderJourney defined:", page.evaluate("typeof renderJourney"))

    # Manually call renderJourney and check for errors
    result = page.evaluate("""
        async () => {
            try {
                await renderJourney();
                return { ok: true, cards: document.querySelectorAll('#journey-region-list .region-card').length };
            } catch(e) {
                return { ok: false, error: e.toString(), stack: e.stack };
            }
        }
    """)
    print("renderJourney() result:", result)

    # Check DOM after call
    print("Cards in list after call:", page.locator("#journey-region-list .region-card").count())
    print("List innerHTML:", repr(page.locator("#journey-region-list").inner_html()[:400]))

    # Check journey screen visibility
    print("Journey screen hidden?", "hidden" in (page.locator("#journey-screen").get_attribute("class") or ""))

    print("\nAll console errors:")
    for e in errors:
        print(" ", e)

    browser.close()
