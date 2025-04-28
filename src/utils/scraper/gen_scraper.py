import asyncio
import json
from typing import Dict, List

from playwright.async_api import Browser, BrowserContext, Page, async_playwright


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
        await self.browser.close()

    async def scrape_site(self, site_id: str) -> List[Dict]:
        site_config = self.config["sites"][site_id]
        url = site_config["url"]
        selectors = site_config["selectors"]

        print(f"Navigating to {url}")
        page = await self.context.new_page()
        await page.goto(url)

        events = []

        city_elements = await page.query_selector_all(selectors["city_container"])

        for city_element in city_elements:
            city_name = await city_element.query_selector(selectors["city_name"])
            if not city_name:
                continue

            city_text = await city_name.inner_text()

            event_elements = await city_element.query_selector_all(
                selectors["event_container"]
            )

            for event_element in event_elements:
                event_data = {"city": city_text}

                date_element = await event_element.query_selector(
                    selectors["event_date"]
                )
                if date_element:
                    event_data["date"] = await date_element.inner_text()

                details_element = await event_element.query_selector(
                    selectors["event_details"]
                )
                if details_element:
                    location_element = await details_element.query_selector(
                        selectors["location"]
                    )
                    if location_element:
                        event_data["location"] = await location_element.inner_text()

                    link_element = await details_element.query_selector(
                        selectors["fair_info_link"]
                    )
                    if link_element:
                        fair_link = await link_element.get_attribute("href")
                        event_data["fair_info_link"] = fair_link

                        if site_config.get("needs_subpage", False):
                            application_link = await self.get_application_link(
                                fair_link, selectors["application_link_page"]
                            )
                            if application_link:
                                event_data["application_link"] = application_link

                events.append(event_data)

        await page.close()
        return events

    async def extract_event_data(self, page, config: Dict) -> Dict:
        return {}

    async def run(self, site_ids=None):
        await self.initialize()
        await self.load_config()

        if site_ids is None:
            site_ids = list(self.config["sites"].keys())

        all_events = {}
        for site_id in site_ids:
            print(f"Scraping {site_id}...")
            events = await self.scrape_site(site_id)
            all_events[site_id] = events

        await self.close()
        return all_events

    async def get_application_link(self, fair_url: str, link_selector: str) -> str:
        application_link = ""

        page = await self.context.new_page()
        try:
            if not fair_url.startswith("http"):
                fair_url = "https://www.renegadecraft.com" + fair_url

            print(f"Navigating to fair page: {fair_url}")
            await page.goto(fair_url)

            link_element = await page.query_selector(link_selector)
            if link_element:
                href = await link_element.get_attribute("href")
                if href:
                    application_link = href
                    if not application_link.startswith("http"):
                        application_link = (
                            "https://www.renegadecraft.com" + application_link
                        )
        except Exception as e:
            print(f"Error getting application link: {e}")
        finally:
            await page.close()

        return application_link


async def main():
    scraper = AppScraper()
    events = await scraper.run(["renegade_craft"])

    with open("events.json", "w") as f:
        json.dump(events, f, indent=2)


if __name__ == "__main__":
    asyncio.run(main())
