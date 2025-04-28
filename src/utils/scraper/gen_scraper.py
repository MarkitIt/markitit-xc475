import asyncio
import json
from typing import Dict, List

from playwright.async_api import async_playwright


# Scraper for self hosted apps site, form event hosts
class AppScraper:
    def __init__(self, config_path: str = "site_config.json"):
        self.config_path = config_path
        self.config = {}
        self.browser = None
        self.context = None

    async def load_config(self):
        with open(self.config_path, "r") as f:
            self.config = json.load(f)

    async def initialize(self):
        playwright = await async_playwright().start()
        self.browser = await playwright.chromium.launch()
        self.context = await self.browser.new_context()

    async def close(self):
        await self.context.close()
        await srlf.browser.close()

    async def scrape_site(self, url: str) -> List[Dict]:
        site_config = self.configs["sites"][site_id]
        events = []
        return events

    async def extract_event_data(self, page, config: Dict) -> Dict:
        return {}

    async def run(self, site_ids=None):
        await self.initialize()
        if site_ids is None:
            site_ids = list(self.configs["sites"].keys())

        all_events = {}
        for site_id in site_ids:
            print(f"Scraping {site_id}...")
            events = await self.scrape_site(site_id)
            all_events[site_id] = events

        await self.close()
        return all_events


async def main():
    scraper = AppScraper()
    await scraper.load_config()
    events = await scraper.run()


if __name__ == "__main__":
    asyncio.run(main())
