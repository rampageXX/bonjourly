"""
Bonjourly — browser tests via file:// URL (static app, no server needed).
JSONBin network calls will fail gracefully (offline mode) — that's expected.
"""

import sys
import os
import io
from pathlib import Path
from playwright.sync_api import sync_playwright

# Fix Windows GBK encoding so emoji in page content doesn't crash stdout
if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

APP_PATH = Path(__file__).parent / "index.html"
BASE_URL  = APP_PATH.as_uri()

FAILURES = []
CONSOLE_LOG = []

def fail(msg):
    print(f"  FAIL: {msg}")
    FAILURES.append(msg)

def ok(msg):
    print(f"  OK:   {msg}")

def run_tests():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context()
        page = ctx.new_page()

        def on_console(msg):
            entry = f"[{msg.type}] {msg.text}"
            CONSOLE_LOG.append(entry)
            if msg.type == "error":
                print(f"    JS ERROR: {msg.text}")

        page.on("console", on_console)
        page.on("pageerror", lambda e: (CONSOLE_LOG.append(f"[pageerror] {e}"), print(f"    PAGEERROR: {e}")))

        # ── Boot / start screen ─────────────────────────────────────────────
        print("\n[1] Boot + start screen")
        page.goto(BASE_URL, wait_until="domcontentloaded")
        page.wait_for_timeout(800)
        page.screenshot(path="shot_01_start.png", full_page=True)

        if page.locator(".player-toggle").count() > 0:
            fail("Player 1 / Player 2 toggle still present")
        else:
            ok("No player-toggle on start screen")

        if page.locator("#name-input").count() == 1:
            ok("Name input found")
        else:
            fail("Name input not found")

        if page.locator("button:has-text('Commencer')").count() > 0:
            ok("Commencer button found")
        else:
            fail("Commencer button not found")

        # ── Login ────────────────────────────────────────────────────────────
        print("\n[2] Home screen after name entry")
        page.fill("#name-input", "TestUser")
        page.click("button:has-text('Commencer')")
        page.wait_for_timeout(2500)   # renderHome is async (JSONBin fetch will fail/timeout)
        page.screenshot(path="shot_02_home.png", full_page=True)

        home_class = page.locator("#home-screen").get_attribute("class") or ""
        if "hidden" not in home_class:
            ok("Home screen visible")
        else:
            fail("Home screen not visible after login")

        lb = page.locator("#home-leaderboard")
        if lb.count() > 0:
            lb_text = lb.inner_text().strip()
            ok(f"Leaderboard container present; content: {repr(lb_text[:80])}")
        else:
            fail("#home-leaderboard element missing")

        if page.locator("#home-points-row").count() > 0:
            ok("#home-points-row in DOM")
        else:
            fail("#home-points-row missing")

        if page.locator("#play-btn").is_visible():
            ok("Play button visible")
        else:
            fail("Play button not visible")

        # ── Stats screen ────────────────────────────────────────────────────
        print("\n[3] Stats screen")
        page.click(".nav-btn[data-screen=stats-screen]")
        page.wait_for_timeout(2500)
        page.screenshot(path="shot_03_stats.png", full_page=True)

        if page.locator(".stats-points-card").count() > 0:
            ok(".stats-points-card dual card present")
        else:
            fail(".stats-points-card missing")

        old_tabs = page.locator("#stats-screen .stats-tab")
        if old_tabs.count() == 0:
            ok("No stale stats-tab buttons in stats screen")
        else:
            fail(f"Found {old_tabs.count()} stale stats-tab buttons")

        for eid in ["stats-total-pts", "stats-weekly-pts", "stats-streak",
                    "stats-longest-streak", "stats-total-days", "stats-days-won"]:
            if page.locator(f"#{eid}").count() > 0:
                ok(f"#{eid} present")
            else:
                fail(f"#{eid} missing")

        if page.locator(".rolling-label").count() > 0:
            ok(".rolling-label badge present")
        else:
            fail(".rolling-label missing")

        # ── Journey screen ──────────────────────────────────────────────────
        print("\n[4] Journey screen")
        page.click(".nav-btn[data-screen=journey-screen]")
        # Wait until renderJourney finishes (fetch may take up to 8s to abort)
        try:
            page.wait_for_function(
                "() => document.querySelectorAll('#journey-region-list .region-card').length > 0",
                timeout=12000
            )
        except Exception:
            pass  # will be caught as failure below
        page.screenshot(path="shot_04_journey.png", full_page=True)

        region_html = page.locator("#journey-region-list").inner_html()
        print(f"    journey-region-list innerHTML (300 chars): {repr(region_html[:300])}")

        cards = page.locator("#journey-region-list .region-card")
        count = cards.count()
        if count > 0:
            ok(f"{count} region cards rendered")
            for i in range(count):
                card  = cards.nth(i)
                name  = card.locator(".region-card-name").inner_text().strip()
                status = card.locator(".region-card-status").inner_text().strip()
                if status == "0 more to unlock":
                    fail(f"Region '{name}' shows '0 more to unlock' but is locked (unlock bug)")
                else:
                    ok(f"Region '{name}': {repr(status)}")
            first_status = cards.first.locator(".region-card-status").inner_text().strip()
            if "Unlocked" in first_status:
                ok("Paris is Unlocked (masteryReq=0)")
            else:
                fail(f"Paris should be Unlocked but shows: {repr(first_status)}")
        else:
            fail("No .region-card elements found in #journey-region-list")
            # Show all children for diagnosis
            children = page.locator("#journey-region-list > *").all()
            print(f"    Children in list: {len(children)}")
            for c in children[:5]:
                print(f"      tag={c.evaluate('e => e.tagName')}, class={c.get_attribute('class')}")

        # ── Visual spot-check screenshots ───────────────────────────────────
        print("\n[5] Screenshots saved:")
        for f in ["shot_01_start.png","shot_02_home.png","shot_03_stats.png","shot_04_journey.png"]:
            size = os.path.getsize(f) if os.path.exists(f) else 0
            print(f"    {f}  ({size:,} bytes)")

        # ── Console error summary ───────────────────────────────────────────
        print("\n[6] Console errors")
        real_errors = [e for e in CONSOLE_LOG
                       if "[error]" in e.lower()
                       and "jsonbin" not in e.lower()
                       and "fetch" not in e.lower()
                       and "failed to fetch" not in e.lower()]
        if real_errors:
            for e in real_errors:
                fail(f"JS error: {e}")
        else:
            ok("No unexpected JS errors (JSONBin network failures are expected offline)")

        browser.close()

    print("\n" + "="*50)
    if FAILURES:
        print(f"RESULT: {len(FAILURES)} failure(s):")
        for f in FAILURES:
            print(f"  - {f}")
        sys.exit(1)
    else:
        print("RESULT: All checks passed")

if __name__ == "__main__":
    run_tests()
