import random
import time
from datetime import datetime

import firebase_admin
import requests
from bs4 import BeautifulSoup
from firebase_admin import credentials, firestore


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

if __name__ == "__main__":
    events = scrape_eventeny()
    # print first item only
    print(events[0])

    if events:
        try:
            events_table = db.collection("events")
            batch = db.batch()

            for event in events:
                event_ref = events_table.document()
                batch.set(event_ref, event)

            batch.commit()
            print("event added to db")
        except Exception as e:
            print("Error: ", e)
    else:
        print("No events found, check scrape_eventeny didnt return anything")
