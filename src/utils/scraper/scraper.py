import random
import time
from datetime import datetime

import firebase_admin
import requests
from bs4 import BeautifulSoup
from firebase_admin import credentials, firestore
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

# TODO:
# 1 more layer of scraping needed to get event host name and description
# need more scraper or api
# for scraper need 1 for each website becuase of setup?? double check


# initialize admin and db with admin
# using client SDK cuz recommended for scraper and "backend" like stuff
def init_firebase_admin():
    if not firebase_admin._apps:
        cred = credentials.Certificate("./firebase-service-account.json")
        firebase_admin.initialize_app(cred)
    return firestore.client()


db = init_firebase_admin()


def scrape_eventeny():

    events = []

    # scraping as if using chrome
    headers = {
        "User-Agent": "Mozilla/5.0 (X11; U; Linux i686; en-US) AppleWebKit/534.3 (KHTML, like Gecko) Chrome/6.0.472.63 Safari/534.3"
    }

    try:
        print("Scraping Eventeny")
        # pre queried search
        # did not do location because of limited result
        response = requests.get(
            "https://www.eventeny.com/events/?l=&q=pop+up&m=",
            headers=headers,
            timeout=13,
        )
        print("eventeny response: ", response)

        soup = BeautifulSoup(response.content, "html.parser")

        event_main_container = soup.find(
            "div", {"data-content": "events-list-container"}
        )
        if not event_main_container:
            print("error at event_main_container")
            return []

        # get all event boxes from evententy (first page for now)
        event_divs = event_main_container.find_all("div", {"class": "event-flashcard"})

        for event in event_divs:
            try:
                # get event data
                name = event.find("meta", {"itemprop": "name"})["content"]
                # need whole attribute to identify
                location_prev = event.find(
                    "span",
                    {
                        "class": "size-14",
                        "style": lambda value: value and "color: #7E7E7E" in value,
                    },
                )
                city, state = location_prev.text.split(",")
                location = {"city": city.strip(), "state": state.strip()}
                date = event.find(
                    "span", {"style": lambda value: value and "color: #08A6A0" in value}
                ).text.strip()

                # hardcode popup for now, eventeny list theme not cat
                catagories = ["pop up"]
                catagory_item = event.get("data-category")
                catagories.append(catagory_item)

                # Single event dict to add
                event = {
                    "name": name,
                    # TODO: next level scrape
                    "description": "",
                    "location": location,
                    # hardcode for now TODO
                    "vendor_id": "Eventeny",
                    "category": catagories,
                    "date": date,
                }

                events.append(event)

            except Exception as e:
                print("Error: ", e)

        return events

    except:
        print("Error: ", e)
        return []


# remove later, comparing div
# <span class="size-14 flex flex-wrap inline overflow-hidden" style="font-weight: 700; color: #7E7E7E; height: 20px;">
# <span class="size-14 flex flex-wrap inline overflow-hidden" style="font-weight: 700; color: #7E7E7E; height: 20px;">


def scrape_eventbrite():
    # scraping as if using chrome
    headers = {
        "User-Agent": "Mozilla/5.0 (X11; U; Linux i686; en-US) AppleWebKit/534.3 (KHTML, like Gecko) Chrome/6.0.472.63 Safari/534.3"
    }

    events = []

    try:
        print("Scraping Eventbrite")

        # set num page to scrape
        for page in range(1, 6):
            print("Scraping eventbrite page:", page)

            response = requests.get(
                f"https://www.eventbrite.com/d/ny--new-york/pop-up/?page={page}",
                headers=headers,
                timeout=13,
            )

            soup = BeautifulSoup(response.content, "html.parser")

            event_main_container = soup.find(
                "ul",
                {
                    "class": "SearchResultPanelContentEventCardList-module__eventList___2wk-D"
                },
            )

            if not event_main_container:
                print("cant find main container for page", page)
                continue

            event_cards = event_main_container.find_all("li")

            for card in event_cards:
                try:
                    event_link = card.find("a", {"class": "event-card-link"})

                    if not event_link:
                        print("cant find event link")
                        continue

                    label = event_link.get("aria-label", "")

                    # eventbrite add this infront
                    # name = label.replace("View ", "")
                    name = label

                    # for checking pop up
                    lower_name = name.lower()

                    if (
                        "pop up" not in lower_name
                        and "pop-up" not in lower_name
                        and "popup" not in lower_name
                    ):
                        # uncomment if want to see skipped events
                        # print(f"Skipping event: '{name}' - not a pop-up event")
                        continue

                    location_elem = event_link.get("data-event-location", "")
                    if location_elem and "," in location_elem:
                        city, state = location_elem.split(",")
                        location = {"city": city.strip(), "state": state.strip()}
                    else:
                        location = {"city": "New York", "state": "NY"}

                    date_elem = card.find(
                        "p",
                        {
                            "class": "Typography_root__487rx #585163 Typography_body-md__487rx event-card__clamp-line--one Typography_align-match-parent__487rx"
                        },
                    )
                    date = date_elem.text.strip() if date_elem else ""

                    venue_elem = card.select_one(
                        "p.Typography_root__487rx.Typography_body-md__487rx:not(:has(time))"
                    )
                    venue = venue_elem.text.strip() if venue_elem else ""

                    price_elem = card.find(
                        "p",
                        {
                            "class": "Typography_root__487rx #3a3247 Typography_body-md-bold__487rx Typography_align-match-parent__487rx"
                        },
                    )
                    price = price_elem.text.strip() if price_elem else ""

                    event_id = event_link.get("data-event-id", "")
                    event_url = event_link.get("href", "")

                    event = {
                        "name": name,
                        # TODO: next level scrape
                        "description": "",
                        "location": location,
                        "venue": venue,
                        # Hardcoded vendor ID
                        "vendor_id": "Eventbrite",
                        "category": ["pop up"],
                        "date": date,
                        "price": price,
                        "event_id": event_id,
                        "url": event_url,
                    }

                    events.append(event)

                except Exception as e:
                    print(f"Error processing card: {e}")

            # incase eventbrite flag
            time.sleep(random.uniform(1, 3))

        return events

    except Exception as e:
        print(f"Error scraping Eventbrite: {e}")
        return []


"""
Using selenium to scrape Zapp cuz of PHP
cant query need to query with selenium
"""


def scrape_zapp():
    events = []

    try:
        print("Scraping Zapp")

        # setup chrome for selenium
        # May need to download chromedriver if u dont have
        options = Options()
        options.add_argument("--headless")
        driver = webdriver.Chrome(options=options)

        driver.get("https://www.zapplication.org/participating-events.php")
        time.sleep(3)

        # search pop up
        search_box = driver.find_element(By.ID, "keywords")
        search_box.clear()
        search_box.send_keys("pop up")
        search_box.send_keys(Keys.RETURN)
        time.sleep(3)

        event_cards = driver.find_elements(
            By.CSS_SELECTOR, "div[data-v-6ccc3a2c].card.mb-3"
        )

        for card in event_cards:
            try:
                name = card.find_element(
                    By.CSS_SELECTOR, "a.font-weight-bold.text"
                ).text.strip()

                # date_container = card.find_element(
                #     By.CSS_SELECTOR, "div:has(span.subtext:contains('Event Dates:'))"
                # )
                # date = date_container.find_element(
                #     By.CSS_SELECTOR, "span.font-weight-bold"
                # ).text.strip()
                date_div = card.find_element(
                    By.XPATH, ".//div[contains(., 'Event Dates:')]"
                )
                date = date_div.find_element(
                    By.CSS_SELECTOR, "span.font-weight-bold"
                ).text.strip()

                location_column = card.find_element(
                    By.CSS_SELECTOR, ".col-md.text-left.text-md-right.pr-2"
                )
                location_text = location_column.find_elements(By.TAG_NAME, "div")[
                    0
                ].text.strip()

                if "," in location_text:
                    city, state = location_text.split(",")
                    location = {"city": city.strip(), "state": state.strip()}
                else:
                    location = {"city": location_text, "state": ""}

                try:
                    fee_div = card.find_element(
                        By.XPATH, ".//div[contains(., 'Fee (Jury fee):')]"
                    )
                    price = fee_div.find_element(
                        By.CSS_SELECTOR, "span.font-weight-bold"
                    ).text.strip()
                except Exception as e:
                    print(f"Fee error: {e}")
                    price = ""

                # same TODO as other
                event = {
                    "name": name,
                    "description": "",
                    "location": location,
                    "vendor_id": "Zapplication",
                    "category": ["pop up"],
                    "date": date,
                    "price": price,
                }

                events.append(event)

            except Exception as e:
                print(f"Error processing card: {e}")

        driver.quit()
        return events

    except Exception as e:
        print(f"Error scraping Zapp: {e}")
        return []


if __name__ == "__main__":
    # events = scrape_eventeny()
    # # print first item only
    # print(events[0])

    # if events:
    #     try:
    #         events_table = db.collection("events")
    #         batch = db.batch()

    #         for event in events:
    #             event_ref = events_table.document()
    #             batch.set(event_ref, event)

    #         batch.commit()
    #         print("event added to db")
    #     except Exception as e:
    #         print("Error: ", e)
    # else:
    #     print("No events found, check scrape_eventeny didnt return anything")

    # TEST EVENTBRITE SCRAPER
    # eventbrite_events = scrape_eventbrite()

    # # Print the total number of events found
    # print(f"\nTotal Eventbrite events found: {len(eventbrite_events)}")

    # # Print the first 15 events or all if less than 15
    # print("\nFirst 15 Eventbrite events:")
    # for i, event in enumerate(eventbrite_events[:15]):
    #     print(f"\nEvent {i+1}:")
    #     print(f"Name: {event['name']}")
    #     print(f"Location: {event['location']['city']}, {event['location']['state']}")
    #     print(f"Venue: {event['venue']}")
    #     print(f"Date: {event['date']}")
    #     print(f"Price: {event['price']}")
    #     print(f"URL: {event['url']}")

    # TEST ZAPP
    zapp_events = scrape_zapp()
    for event in zapp_events[:10]:
        print(f"\nName: {event['name']}")
        print(f"Location: {event['location']['city']}, {event['location']['state']}")
        print(f"Date: {event['date']}")
        print(f"Price: {event.get('price', 'N/A')}")
