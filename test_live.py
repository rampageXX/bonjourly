"""Check live app on localhost — capture console + network errors."""
import sys, io
from playwright.sync_api import sync_playwright
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

BASE = "http://localhost:8766"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    logs = []
    page.on("console", lambda m: logs.append(f"[{m.type}] {m.text}"))
    page.on("pageerror", lambda e: logs.append(f"[PAGEERROR] {e}"))

    page.goto(BASE, wait_until="domcontentloaded")
    page.wait_for_timeout(800)

    # Enter name and go to home
    page.fill("#name-input", "TestUser")
    page.click("button:has-text('Commencer')")
    page.wait_for_timeout(25000)   # wait for blob fetch (JSONBin ~6s) + margin
    page.screenshot(path="live_home.png", full_page=True)
    print("Home leaderboard:", repr(page.locator("#home-leaderboard").inner_text()[:200]))
    print("Points row visible:", page.locator("#home-points-row").is_visible())
    print("Points alltime:", page.locator("#home-points-alltime").inner_text())
    print("Points week:", page.locator("#home-points-week").inner_text())

    # Stats
    page.click(".nav-btn[data-screen=stats-screen]")
    page.wait_for_timeout(25000)
    page.screenshot(path="live_stats.png", full_page=True)
    print("stats-total-pts:", page.locator("#stats-total-pts").inner_text())
    print("stats-weekly-pts:", page.locator("#stats-weekly-pts").inner_text())
    print("stats-streak:", page.locator("#stats-streak").inner_text())

    print("\n--- Console log ---")
    for l in logs:
        print(" ", l)

    browser.close()
