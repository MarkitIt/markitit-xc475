import random
import time
from datetime import datetime

import firebase_admin
import requests
from bs4 import BeautifulSoup
from firebase_admin import credentials, firestore
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager


# initialize admin and db with admin
# using client SDK cuz recommended for scraper and "backend" like stuff
def init_firebase_admin():
    if not firebase_admin._apps:
        cred = credentials.Certificate("./firebase-service-account.json")
        firebase_admin.initialize_app(cred)
    return firestore.client()


db = init_firebase_admin()

SEARCH_KEYWORDS = [
    "pop up",
    "popup",
    "bazaar",
    "vendors needed",
    "market fair",
    "craft fair",
    "artisan market",
    "vendor market",
]

# how eventbrite does url locations

EVENTBRITE_LOCATIONS = ["ny--new-york", "ma--boston"]


def scrape_eventeny():

    events = []

    # scraping as if using chrome
    headers = {
        "User-Agent": "Mozilla/5.0 (X11; U; Linux i686; en-US) AppleWebKit/534.3 (KHTML, like Gecko) Chrome/6.0.472.63 Safari/534.3"
    }

    try:
        print("Scraping Eventeny")

        for keyword in SEARCH_KEYWORDS:
            print(f"Searching Eventeny for keyword: {keyword}")
            url_keyword = keyword.replace(" ", "+")

            response = requests.get(
                f"https://www.eventeny.com/events/?l=&q={url_keyword}&m=",
                headers=headers,
                timeout=13,
            )
            print(f"eventeny keyword res {keyword}: ", response)

            soup = BeautifulSoup(response.content, "html.parser")

            event_main_container = soup.find(
                "div", {"data-content": "events-list-container"}
            )
            if not event_main_container:
                print("error at event_main_container")
                return []

            # get all event boxes from evententy (first page for now)
            event_divs = event_main_container.find_all(
                "div", {"class": "event-flashcard"}
            )

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
                        "span",
                        {"style": lambda value: value and "color: #08A6A0" in value},
                    ).text.strip()

                    # get url for details
                    url_meta = event.find("meta", {"itemprop": "url"})
                    event_url = url_meta["content"] if url_meta else None

                    image_meta = event.find("meta", {"itemprop": "image"})
                    image = image_meta["content"] if image_meta else ""

                    # hardcode popup for now, eventeny list theme not cat
                    type_tags = ["pop up"]
                    category_item = event.get("data-category")
                    type_tags.append(category_item)

                    # Single event dict to add
                    event_data = {
                        "name": name,
                        "description": "",
                        "location": location,
                        # "vendor_id": "Eventeny",
                        "type": type_tags,
                        "date": date,
                        "image": image,
                        # "host": "",
                        "vendorFee": None,
                        "totalCost": None,
                        "attendeeType": [],
                        "headcount": None,
                        "demographics": [],
                        "startDate": {"seconds": 0, "nanoseconds": 0},
                        "endDate": {"seconds": 0, "nanoseconds": 0},
                        "score": None,
                        "scoreBreakdown": None,
                    }

                    if event_url:
                        # random delays incase of flag
                        time.sleep(random.uniform(1, 2))
                        details = scrape_eventeny_details(event_url, headers)

                        # Update event data with details
                        if details:
                            if "description" in details:
                                event_data["description"] = details["description"]
                            # if "host" in details:
                            #     event_data["host"] = details["host"]
                            if "image" in details and not event_data["image"]:
                                event_data["image"] = details["image"]
                            # if "full_address" in details:
                            #     event_data["full_address"] = details["full_address"]
                            # if "detailed_date" in details:
                            #     event_data["detailed_date"] = details["detailed_date"]

                    events.append(event_data)

                except Exception as e:
                    print("Error: ", e)

                time.sleep(random.uniform(2, 4))

        return events

    except:
        print("Error: ", e)
        return []


def scrape_eventeny_details(event_url, headers):
    try:
        print(f"Scraping more info for: {event_url}")
        response = requests.get(event_url, headers=headers, timeout=15)
        if response.status_code != 200:
            print(f"cant go into detail's link {response.status_code}")
            return {}

        soup = BeautifulSoup(response.content, "html.parser")
        details = {}

        # event description
        description_div = soup.find("div", {"class": "overview-text-maxheight"})
        if description_div:
            details["description"] = description_div.text.strip()

        # event address
        # address_link = soup.find("a", {"class": "stronger text-secondary-2 underline"})
        # if address_link:
        #     details["full_address"] = address_link.text.strip()

        # event host info
        # host_div = soup.find("div", {"class": "heading-4 mb1"})
        # if host_div and "Hosted by" in host_div.text:
        #     details["host"] = host_div.text.replace("Hosted by", "").strip()

        # image url
        # NOTE: image is currently using the link from eventeny instead of downloading
        img_meta = soup.find("meta", {"itemprop": "image"})
        if img_meta:
            details["image"] = img_meta.get("content")

        # event time
        date_div = soup.find("div", {"class": "mb1 body-1"})
        if date_div:
            details["detailed_date"] = date_div.text.strip()

        return details
    except Exception as e:
        print(f"Error scraping event details: {e}")
        return {}


def scrape_eventbrite():
    # scraping as if using chrome
    headers = {
        "User-Agent": "Mozilla/5.0 (X11; U; Linux i686; en-US) AppleWebKit/534.3 (KHTML, like Gecko) Chrome/6.0.472.63 Safari/534.3"
    }

    events = []

    try:
        print("Scraping Eventbrite")

        for location_path in EVENTBRITE_LOCATIONS:
            for keyword in SEARCH_KEYWORDS:
                url_keyword = keyword.replace(" ", "-")
                print(f"eventbrite keyword and location: {keyword} {location_path}")

                for page in range(1, 13):
                    response = requests.get(
                        f"https://www.eventbrite.com/d/{location_path}/{url_keyword}/?page={page}",
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
                                location = {
                                    "city": city.strip(),
                                    "state": state.strip(),
                                }
                            else:
                                if "ny--new-york" in location_path:
                                    location = {"city": "New York", "state": "NY"}
                                elif "ma--boston" in location_path:
                                    location = {"city": "Boston", "state": "MA"}
                                else:
                                    location = {"city": "", "state": ""}

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

                            img_element = card.find(
                                "img", {"class": "event-card-image"}
                            )
                            image = (
                                img_element["src"]
                                if img_element and img_element.has_attr("src")
                                else ""
                            )

                            event_data = {
                                "name": name,
                                "description": "",
                                "location": location,
                                # "venue": venue,
                                # "vendor_id": "Eventbrite",
                                "type": ["pop up"],
                                # "date": date,
                                # "price": price,
                                "id": event_id,
                                # "url": event_url,
                                "image": image,
                                # "host": "",
                                "vendorFee": None,
                                "totalCost": None,
                                "attendeeType": [],
                                "headcount": None,
                                "demographics": [],
                                "startDate": {"seconds": 0, "nanoseconds": 0},
                                "endDate": {"seconds": 0, "nanoseconds": 0},
                                "score": None,
                                "scoreBreakdown": None,
                            }

                            if event_url:
                                # random delays incase of flag
                                time.sleep(random.uniform(1, 3))
                                details = scrape_eventbrite_details(event_url, headers)

                                # Update with details
                                if details:
                                    if "description" in details:
                                        event_data["description"] = details[
                                            "description"
                                        ]
                                    # if "host" in details:
                                    #     event_data["host"] = details["host"]
                                    if "image" in details and not event_data["image"]:
                                        event_data["image"] = details["image"]
                                    # if "full_address" in details:
                                    #     event_data["full_address"] = details["full_address"]
                                    # if "detailed_date" in details:
                                    #     event_data["detailed_date"] = details["detailed_date"]
                                    if "additional_tags" in details:
                                        for tag in details["additional_tags"]:
                                            if tag not in event_data["type"]:
                                                event_data["type"].append(tag)

                            events.append(event_data)

                        except Exception as e:
                            print(f"Error processing card: {e}")

                    # incase eventbrite flag
                    time.sleep(random.uniform(1, 3))

            time.sleep(random.uniform(1, 3))

        return events

    except Exception as e:
        print(f"Error scraping Eventbrite: {e}")
        return []


def scrape_eventbrite_details(event_url, headers):
    try:
        print(f"Scraping details for: {event_url}")
        response = requests.get(event_url, headers=headers, timeout=15)
        if response.status_code != 200:
            print(
                f"get go into eventbrite link: {response.status_code} for {event_url}"
            )
            return {}

        soup = BeautifulSoup(response.content, "html.parser")
        details = {}

        # event description
        description_div = soup.find(
            "div", {"class": "has-user-generated-content event-description__content"}
        )
        if description_div:
            # need to combine elements
            paragraphs = description_div.find_all("p")
            description_text = "\n".join(
                [p.text.strip() for p in paragraphs if p.text.strip()]
            )
            details["description"] = description_text

        # address
        # location_div = soup.find("div", {"class": "location-info__address"})
        # if location_div:
        #     address_text = location_div.text.strip()
        #     details["full_address"] = address_text

        # # information
        # organizer_name = soup.find(
        #     "strong", {"class": "organizer-listing-info-variant-b__name-link"}
        # )
        # if organizer_name:
        #     details["host"] = organizer_name.text.strip()

        # # date/time
        # date_span = soup.find("span", {"class": "date-info__full-datetime"})
        # if date_span:
        #     details["detailed_date"] = date_span.text.strip()

        # image url
        img_element = soup.select_one("picture[data-testid='hero-image'] img")
        if img_element and img_element.has_attr("src"):
            details["image"] = img_element["src"]

        # tags
        tags = []
        tags_ul = soup.find("section", {"aria-labelledby": "tags-heading"})
        if tags_ul:
            tag_links = tags_ul.find_all("a", {"class": "tags-link"})
            for tag in tag_links:
                tag_text = tag.text.strip()
                if tag_text.startswith("#"):
                    # Remove the # and replace underscores with spaces
                    clean_tag = tag_text[1:].replace("_", " ")
                    tags.append(clean_tag)
                elif "pop up" in tag_text.lower() or "popup" in tag_text.lower():
                    tags.append("pop up")

        if tags:
            details["additional_tags"] = tags

        return details

    except Exception as e:
        print(f"Error scraping event details: {e}")
        return {}


"""
Using selenium to scrape Zapp cuz of PHP
cant query need to query with selenium
using xquery and selectors
"""


def scrape_zapp():
    events = []
    # for id and first layer info
    basic_event_info = []

    try:
        options = Options()
        options.add_argument("--headless")
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)

        for keyword in SEARCH_KEYWORDS:
            basic_event_info = []

            try:
                driver.get("https://www.zapplication.org/participating-events.php")
                time.sleep(5)

                print(f"Searching Zapp for keyword: {keyword}")
                search_box = driver.find_element(By.ID, "keywords")
                search_box.clear()
                search_box.send_keys(keyword)
                search_box.send_keys(Keys.RETURN)
                time.sleep(5)

                event_cards = driver.find_elements(
                    By.CSS_SELECTOR, "div[data-v-6ccc3a2c].card.mb-3"
                )

                for card in event_cards:
                    try:
                        name_element = card.find_element(
                            By.CSS_SELECTOR, "a.font-weight-bold.text"
                        )
                        name = name_element.text.strip()

                        event_link = name_element.get_attribute("href")
                        event_id = (
                            event_link.split("ID=")[1] if "ID=" in event_link else None
                        )

                        if not event_id:
                            print(f"no ID for: {name}, skipped")
                            continue

                        try:
                            date_div = card.find_element(
                                By.XPATH, ".//div[contains(., 'Event Dates:')]"
                            )
                            date = date_div.find_element(
                                By.CSS_SELECTOR, "span.font-weight-bold"
                            ).text.strip()
                        except Exception as e:
                            print(f"Error getting date for {name}: {e}")
                            date = ""

                        try:
                            location_column = card.find_element(
                                By.CSS_SELECTOR, ".col-md.text-left.text-md-right.pr-2"
                            )
                            location_text = location_column.find_elements(
                                By.TAG_NAME, "div"
                            )[0].text.strip()

                            if "," in location_text:
                                city, state = location_text.split(",")
                                location = {
                                    "city": city.strip(),
                                    "state": state.strip(),
                                }
                            else:
                                location = {"city": location_text, "state": ""}
                        except Exception as e:
                            print(f"Error getting location for {name}: {e}")
                            location = {"city": "", "state": ""}

                        # get app fee
                        try:
                            fee_div = card.find_element(
                                By.XPATH, ".//div[contains(., 'Fee')]"
                            )
                            fee = fee_div.find_element(
                                By.CSS_SELECTOR, "span.font-weight-bold"
                            ).text.strip()
                        except Exception as e:
                            print(f"Error getting fee for {name}: {e}")
                            fee = ""

                        # basic info from outside cards
                        basic_event_info.append(
                            {
                                "name": name,
                                "date": date,
                                "location": location,
                                "id": event_id,
                                # "url": event_link,
                                # "fee": fee,
                            }
                        )
                    except Exception as e:
                        print(f"Error in first pass for event card: {e}")

                # second loop go into link for description and more info
                # have a lot of info like process, fee breakdown ect if needed
                for basic_info in basic_event_info:
                    try:
                        event_id = basic_info["id"]
                        driver.get(
                            f"https://www.zapplication.org/event-info.php?ID={event_id}"
                        )
                        time.sleep(2)

                        description_sections = []
                        try:
                            event_info_section = driver.find_element(
                                By.XPATH,
                                "//h2[@id='event-info']/following-sibling::div[1]",
                            )
                            description_sections.append(event_info_section.text.strip())
                        except:
                            print(
                                f"Couldn't find event info section for: {basic_info['name']}"
                            )

                        try:
                            general_info_section = driver.find_element(
                                By.XPATH,
                                "//h2[contains(text(), 'GENERAL INFORMATION')]/following-sibling::div[1]",
                            )
                            description_sections.append(
                                general_info_section.text.strip()
                            )
                        except:
                            pass

                        try:
                            booth_info_section = driver.find_element(
                                By.XPATH,
                                "//h2[contains(text(), 'BOOTH INFORMATION')]/following-sibling::div[1]",
                            )
                            description_sections.append(booth_info_section.text.strip())
                        except:
                            pass

                        try:
                            rules_section = driver.find_element(
                                By.XPATH,
                                "//h2[contains(text(), 'RULES/REGULATIONS')]/following-sibling::div[1]",
                            )
                            description_sections.append(rules_section.text.strip())
                        except:
                            pass

                        # combine all, cuz zapp split them into different div
                        description = "\n\n".join(description_sections)

                        # use old method
                        if not description:
                            try:
                                all_div_elements = driver.find_elements(
                                    By.CSS_SELECTOR, "div.my-4 div"
                                )
                                description = "\n\n".join(
                                    [
                                        div.text.strip()
                                        for div in all_div_elements
                                        if div.text.strip()
                                    ]
                                )
                            except:
                                print(
                                    f"Couldn't find any description for: {basic_info['name']}"
                                )
                                description = ""

                        # price = ""
                        # try:
                        #     fee_section = driver.find_element(
                        #         By.XPATH,
                        #         "//span[contains(., 'Fee:')]/following-sibling::text()[1]",
                        #     )
                        #     price = fee_section.strip()
                        # except:
                        #     try:
                        #         fee_section = driver.find_element(
                        #             By.XPATH,
                        #             "//span[contains(@class, 'font-weight-bold')][contains(., 'Fee:')]",
                        #         )
                        #         price = fee_section.find_element(
                        #             By.XPATH, "following-sibling::text()[1]"
                        #         ).strip()
                        #     except:
                        #         try:
                        #             fee_section = driver.find_element(
                        #                 By.CSS_SELECTOR,
                        #                 ".col-md-4 span.font-weight-bold:contains('Fee:')",
                        #             )
                        #             price = fee_section.parent.text.replace("Fee:", "").strip()
                        #         except:
                        #             print(f"Couldn't find fee for: {basic_info['name']}")

                        # price = basic_info.get("fee", "")
                        # if not price:
                        #     try:
                        #         fee_elements = driver.find_elements(
                        #             By.XPATH,
                        #             "//*[contains(text(), 'Fee:') or contains(text(), 'fee')]",
                        #         )
                        #         for fee_elem in fee_elements:
                        #             fee_text = fee_elem.text
                        #             if "Fee:" in fee_text and len(fee_text) < 100:
                        #                 price = fee_text.replace("Fee:", "").strip()
                        #                 break
                        #     except:
                        #         print(f"Couldn't find fee for: {basic_info['name']}")

                        # full_address = ""
                        # try:
                        #     address_elements = driver.find_elements(
                        #         By.XPATH, "//*[contains(text(), 'Where:')]"
                        #     )
                        #     for addr_elem in address_elements:
                        #         addr_text = addr_elem.text
                        #         if "Where:" in addr_text:
                        #             full_address = addr_text.replace("Where:", "").strip()
                        #             break
                        # except:
                        #     print(f"Couldn't find detailed address for: {basic_info['name']}")

                        # detailed_date = basic_info["date"]
                        # try:
                        #     date_elements = driver.find_elements(
                        #         By.XPATH, "//*[contains(text(), 'When:')]"
                        #     )
                        #     for date_elem in date_elements:
                        #         date_text = date_elem.text
                        #         if "When:" in date_text:
                        #             detailed_date = date_text.replace("When:", "").strip()
                        #             break
                        # except:
                        #     print(f"Couldn't find detailed date for: {basic_info['name']}")

                        # host = ""
                        # try:
                        #     host_elements = driver.find_elements(
                        #         By.XPATH,
                        #         "//*[contains(text(), 'Hosted by') or contains(text(), 'Organizer')]",
                        #     )
                        #     for host_elem in host_elements:
                        #         host_text = host_elem.text
                        #         if "Hosted by" in host_text or "Organizer" in host_text:
                        #             host = (
                        #                 host_text.replace("Hosted by", "")
                        #                 .replace("Organizer:", "")
                        #                 .strip()
                        #             )
                        #             # Limit to reasonable length
                        #             if len(host) > 50:
                        #                 host = host[:50] + "..."
                        #             break
                        # except:
                        #     print(f"Couldn't find host for: {basic_info['name']}")

                        event = {
                            "name": basic_info["name"],
                            "description": description,
                            "location": basic_info["location"],
                            # "full_address": full_address,
                            # "vendor_id": "Zapplication",
                            "type": ["pop up"],
                            "date": basic_info["date"],
                            # "detailed_date": detailed_date,
                            # "price": price,
                            # "host": host,
                            "id": event_id,
                            # "url": basic_info["url"],
                            "image": "",  # Zapplication don't have images for events
                            "vendorFee": None,
                            "totalCost": None,
                            "attendeeType": [],
                            "headcount": None,
                            "demographics": [],
                            "startDate": {"seconds": 0, "nanoseconds": 0},
                            "endDate": {"seconds": 0, "nanoseconds": 0},
                            "score": None,
                            "scoreBreakdown": None,
                        }

                        events.append(event)

                    except Exception as e:
                        print(e)
                        continue

            except Exception as e:
                print(f"Error processing keyword '{keyword}': {e}")

        driver.quit()
        return events

    except Exception as e:
        print(f"Error scraping Zapp {e}")
        driver.quit()
        return []


def scrape_eventhub():
    events = []

    try:
        print("Scraping EventHub using Selenium")

        # Chrome without headless mode
        options = Options()
        # Non-headless mode for better reliability
        # options.add_argument("--headless")
        options.add_argument("--window-size=1920,1080")
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)

        processed_urls = set()

        regions = [
            "SOUTH - E",
            "SOUTH - W",
            "SOUTH - Atl",
            "NEW ENGLAND",
            "MIDWEST - W",
            "MIDWEST - E",
            "CALIFORNIA",
        ]
        url_regions = "%2C".join([region.replace(" ", "%20") for region in regions])

        # number of page scrape
        for page in range(1, 6):
            base_url = "https://eventhub.net/marketplace"
            search_url = f"{base_url}?keyword=market&region={url_regions}&eventDateFrom=&eventDateTo=&attendance=&eventType=&currentPage={page}&pageSize=20&sort=name%3Aasc"

            print(f"Scraping EventHub page {page}, URL: {search_url}")

            try:
                driver.get(search_url)
                time.sleep(2)
                event_items = []

                event_cards = driver.find_elements(
                    By.CSS_SELECTOR, "a[href^='/events/']"
                )
                print(f"Found {len(event_cards)} event cards on page {page}")

                for card in event_cards:
                    try:
                        href = card.get_attribute("href")
                        if not href or href in processed_urls:
                            continue

                        event_info = {"url": href}

                        try:
                            name_elem = card.find_element(
                                By.CSS_SELECTOR, "p.font-medium.two-line-ellipsis"
                            )
                            event_info["name"] = (
                                name_elem.text.strip() if name_elem else ""
                            )
                        except:
                            continue

                        try:
                            date_elem = card.find_element(
                                By.CSS_SELECTOR,
                                "div.flex.space-x-1.items-center p.text-sm",
                            )
                            event_info["date"] = date_elem.text.strip()
                        except:
                            event_info["date"] = ""

                        event_info["location"] = {"city": "", "state": ""}
                        try:
                            grid_container = card.find_element(
                                By.CSS_SELECTOR, "div.text-sm.grid"
                            )

                            location_spans = grid_container.find_elements(
                                By.CSS_SELECTOR, "span.capitalize"
                            )

                            if location_spans and len(location_spans) > 0:
                                location_text = location_spans[-1].text.strip()

                                if "," in location_text:
                                    city, state = location_text.split(",", 1)
                                    event_info["location"] = {
                                        "city": city.strip(),
                                        "state": state.strip(),
                                    }
                                else:
                                    parts = location_text.split()
                                    if len(parts) >= 2 and len(parts[-1]) <= 3:
                                        event_info["location"] = {
                                            "city": " ".join(parts[:-1]),
                                            "state": parts[-1],
                                        }
                                    else:
                                        event_info["location"] = {
                                            "city": location_text,
                                            "state": "",
                                        }
                        except Exception as e:
                            print(f"Error getting location: {e}")

                        event_items.append(event_info)
                        processed_urls.add(href)

                    except Exception as e:
                        print(f"Error processing event card: {e}")
                        continue

                print(f"Extracted info for {len(event_items)} events on page {page}")

                for event_info in event_items:
                    try:
                        print(f"Processing event: {event_info['url']}")

                        driver.get(event_info["url"])
                        time.sleep(2)

                        name = event_info["name"]
                        date = event_info["date"]
                        location = event_info["location"]

                        image = ""
                        try:
                            img_elem = driver.find_element(
                                By.CSS_SELECTOR, "img.cursor-pointer.block"
                            )
                            image = img_elem.get_attribute("src")
                        except:
                            try:
                                img_elem = driver.find_element(
                                    By.CSS_SELECTOR, "img.object-cover"
                                )
                                image = img_elem.get_attribute("src")
                            except Exception as e:
                                print(f"Could not find image for {name}: {e}")

                        description = ""
                        try:
                            about_elem = driver.find_element(
                                By.CSS_SELECTOR, "#about p.font-normal"
                            )
                            description = about_elem.text.strip()
                        except Exception as e:
                            print(f"Could not find description for {name}: {e}")

                        additional_sections = []

                        sections = {
                            "Demographics": "#demographics",
                            "Special Notes": "#special-notes",
                            "Amenities": "#amenities",
                            "Prohibited Categories": "#prohibited",
                        }

                        for section_name, selector in sections.items():
                            try:
                                section_elem = driver.find_element(
                                    By.CSS_SELECTOR, selector
                                )
                                section_text = section_elem.text.strip()
                                if section_text:
                                    additional_sections.append(
                                        f"\n\n**{section_name}**\n{section_text}"
                                    )
                            except:
                                pass

                        try:
                            marketing_div = driver.find_element(
                                By.XPATH,
                                "//div[contains(@class, 'px-2') and contains(@class, 'py-3') and contains(@class, 'mt-4') and contains(@class, 'rounded-lg') and contains(text(), 'Marketing Statistics')]",
                            )
                            additional_sections.append(
                                f"\n\n**Marketing Statistics**\n{marketing_div.text.strip()}"
                            )
                        except:
                            pass

                        try:
                            partners_div = driver.find_element(
                                By.XPATH,
                                "//div[contains(@class, 'px-2') and contains(@class, 'py-3') and contains(@class, 'mt-4') and contains(@class, 'rounded-lg') and contains(text(), 'Participating Partners')]",
                            )
                            additional_sections.append(
                                f"\n\n**Participating Partners**\n{partners_div.text.strip()}"
                            )
                        except:
                            pass

                        if description and additional_sections:
                            description += "".join(additional_sections)

                        vendor_fee = None
                        try:
                            fee_elems = driver.find_elements(
                                By.CSS_SELECTOR,
                                "div.flex.flex-col.px-2.py-1.mb-2.rounded.wrap-text span.flex-1",
                            )
                            if fee_elems:
                                fees = [
                                    fee.text.strip()
                                    for fee in fee_elems
                                    if fee.text.strip()
                                ]
                                if fees:
                                    vendor_fee = ", ".join(fees)
                        except:
                            print(f"Could not find vendor fee for: {name}")

                        event_type = "pop up"
                        try:
                            type_elems = driver.find_elements(
                                By.CSS_SELECTOR, "span.capitalize"
                            )
                            for elem in type_elems:
                                elem_text = elem.text.strip().lower()
                                if (
                                    elem_text
                                    and elem_text != "pop up"
                                    and elem_text != "popup"
                                ):
                                    event_type = elem_text
                                    break
                        except:
                            pass

                        event_data = {
                            "name": name,
                            "description": description,
                            "location": location,
                            "type": (
                                ["pop up", event_type]
                                if event_type != "pop up"
                                else ["pop up"]
                            ),
                            "date": date,
                            "image": image,
                            "vendorFee": vendor_fee,
                            "totalCost": None,
                            "attendeeType": [],
                            "headcount": None,
                            "demographics": [],
                            "startDate": {"seconds": 0, "nanoseconds": 0},
                            "endDate": {"seconds": 0, "nanoseconds": 0},
                            "score": None,
                            "scoreBreakdown": None,
                        }

                        events.append(event_data)
                        print(f"Successfully added event: {name}")

                        time.sleep(random.uniform(1, 2))

                    except Exception as e:
                        print(f"Error processing event: {e}")
                        continue

            except Exception as e:
                print(f"Error processing page {page}: {e}")

            time.sleep(random.uniform(2, 3))

        driver.quit()
        print(f"Finished scraping EventHub. Found {len(events)} events.")
        return events

    except Exception as e:
        print(f"Error in EventHub scraper: {e}")
        try:
            driver.quit()
        except:
            pass
        return []


def scrape_eventhub_details(event_url, headers):
    try:
        print(f"Scraping details for: {event_url}")
        response = requests.get(event_url, headers=headers, timeout=15)
        if response.status_code != 200:
            print(
                f"Failed to get EventHub details: {response.status_code} for {event_url}"
            )
            return {}

        soup = BeautifulSoup(response.content, "html.parser")
        details = {}

        description_div = soup.find("div", {"id": "about"})
        if description_div:
            description_p = description_div.find(
                "p", {"class": "font-normal text-lg mb-2 break-words"}
            )
            if description_p:
                description_text = description_p.text.strip()
                details["description"] = description_text

                # Collect additional sections to append to description
                # for gemini parsing
                additional_sections = []

                demographics_div = soup.find("div", {"id": "demographics"})
                if demographics_div:
                    additional_sections.append("\n\n**Demographics**")
                    demographics_content = demographics_div.text.strip()
                    additional_sections.append(demographics_content)

                # marketing stat section
                marketing_div = soup.find(
                    "div",
                    {"class": "px-2 py-3 mt-4 rounded-lg"},
                    text=lambda t: t and "Marketing Statistics" in t,
                )
                if marketing_div:
                    additional_sections.append("\n\n**Marketing Statistics**")
                    marketing_content = marketing_div.text.strip()
                    additional_sections.append(marketing_content)

                # partners section
                partners_div = soup.find(
                    "div",
                    {"class": "px-2 py-3 mt-4 rounded-lg"},
                    text=lambda t: t and "Participating Partners" in t,
                )
                if partners_div:
                    additional_sections.append("\n\n**Participating Partners**")
                    partners_content = partners_div.text.strip()
                    additional_sections.append(partners_content)

                # special section
                notes_div = soup.find("div", {"id": "special-notes"})
                if notes_div:
                    additional_sections.append("\n\n**Special Notes**")
                    notes_content = notes_div.text.strip()
                    additional_sections.append(notes_content)

                # amenities section
                amenities_div = soup.find("div", {"id": "amenities"})
                if amenities_div:
                    additional_sections.append("\n\n**Amenities**")
                    amenities_content = amenities_div.text.strip()
                    additional_sections.append(amenities_content)

                # prohibited section
                prohibited_div = soup.find("div", {"id": "prohibited"})
                if prohibited_div:
                    additional_sections.append("\n\n**Prohibited Categories**")
                    prohibited_content = prohibited_div.text.strip()
                    additional_sections.append(prohibited_content)

                # combine into description
                if additional_sections:
                    details["description"] = description_text + "".join(
                        additional_sections
                    )

        img_element = soup.find(
            "img",
            {
                "class": "cursor-pointer block max-h-full w-full object-cover object-center p-0"
            },
        )
        if img_element and img_element.has_attr("src"):
            details["image"] = img_element["src"]

        vendor_fees = []
        fee_divs = soup.find_all(
            "div",
            {
                "class": "flex flex-col px-2 py-1 mb-2 rounded wrap-text hover:bg-hub-grey"
            },
        )
        for fee_div in fee_divs:
            fee_span = fee_div.find(
                "span", {"class": "flex-1 pr-5 text-base lg:text-sm xl:text-base"}
            )
            if fee_span:
                vendor_fees.append(fee_span.text.strip())

        if vendor_fees:
            details["vendor_fee"] = ", ".join(vendor_fees)

        schedule_div = soup.find("div", {"id": "schedule"})
        if schedule_div:
            date_span = schedule_div.find("span", {"class": "font-medium"})
            time_span = schedule_div.find("span", {"class": "col-span-1"})

            if date_span and time_span:
                details["detailed_date"] = (
                    f"{date_span.text.strip()} {time_span.text.strip()}"
                )

        return details

    except Exception as e:
        print(f"Error scraping EventHub details: {e}")
        return {}


# need event id for duplicate
def make_event_id(event):
    return f"{event['name']}-{event['type'][0]}-{event['location']['city']}"


#  python3 scraper.py
if __name__ == "__main__":
    all_events = []

    # Get and append events from sources
    eventeny_events = scrape_eventeny()
    all_events.extend(eventeny_events)
    eventbrite_events = scrape_eventbrite()
    all_events.extend(eventbrite_events)
    zapp_events = scrape_zapp()
    all_events.extend(zapp_events)
    eventhub_events = scrape_eventhub()
    all_events.extend(eventhub_events)

    if all_events:
        try:
            events_table = db.collection("events")
            batch = db.batch()

            new_events = 0
            duplicate_count = 0

            for event in all_events:
                # make unique id and check if there duplicate
                event_unique_id = make_event_id(event)
                event["id"] = event_unique_id

                matching_events = events_table.where("id", "==", event_unique_id).get()

                if not matching_events:
                    event_ref = events_table.document()
                    batch.set(event_ref, event)
                    new_events += 1
                else:
                    duplicate_count += 1

            if new_events > 0:
                batch.commit()
                print(f"Added {new_events} new events")
            else:
                print("no new event")

            print(f"{duplicate_count} duplicate events")

        except Exception as e:
            print("error adding events to db", e)
    else:
        print("no events found")


# Runs all scrapers and add to file to analyze
def sample_events_from_scrapers():
    all_samples = []

    try:
        print("Collecting event samples from Eventeny...")
        eventeny_events = scrape_eventeny()
        eventeny_sample = random.sample(eventeny_events, min(4, len(eventeny_events)))
        all_samples.append(("Eventeny", eventeny_sample))
    except Exception as e:
        print(f"Error sampling from Eventeny: {e}")

    try:
        print("Collecting event samples from Eventbrite...")
        eventbrite_events = scrape_eventbrite()
        eventbrite_sample = random.sample(
            eventbrite_events, min(4, len(eventbrite_events))
        )
        all_samples.append(("Eventbrite", eventbrite_sample))
    except Exception as e:
        print(f"Error sampling from Eventbrite: {e}")

    try:
        print("Collecting event samples from Zapp...")
        zapp_events = scrape_zapp()
        zapp_sample = random.sample(zapp_events, min(4, len(zapp_events)))
        all_samples.append(("Zapp", zapp_sample))
    except Exception as e:
        print(f"Error sampling from Zapp: {e}")

    try:
        print("Collecting event samples from EventHub...")
        eventhub_events = scrape_eventhub()
        eventhub_sample = random.sample(eventhub_events, min(4, len(eventhub_events)))
        all_samples.append(("EventHub", eventhub_sample))
    except Exception as e:
        print(f"Error sampling from EventHub: {e}")

    try:
        with open("scrape_data.txt", "w") as f:
            f.write("EVENT SAMPLES FROM SCRAPERS\n")
            f.write("==========================\n\n")

            for source, events in all_samples:
                f.write(f"SOURCE: {source}\n")
                f.write(f"Number of events sampled: {len(events)}\n")
                f.write("---------------------------\n\n")

                for i, event in enumerate(events):
                    f.write(f"EVENT {i+1}:\n")
                    f.write(f"Name: {event.get('name', 'N/A')}\n")
                    f.write(
                        f"Location: {event.get('location', {}).get('city', 'N/A')}, {event.get('location', {}).get('state', 'N/A')}\n"
                    )
                    f.write(f"Date: {event.get('date', 'N/A')}\n")
                    f.write(f"Type: {', '.join(event.get('type', ['N/A']))}\n")
                    f.write(f"Image URL: {event.get('image', 'N/A')}\n")

                    description = event.get("description", "N/A")
                    if len(description) > 500:
                        description = description[:497] + "..."
                    f.write(f"Description: {description}\n")

                    other_fields = []
                    for key, value in event.items():
                        if key not in [
                            "name",
                            "location",
                            "date",
                            "type",
                            "image",
                            "description",
                        ]:
                            if value:  # Only include non-empty values
                                other_fields.append(f"{key}: {value}")

                    if other_fields:
                        f.write("Other Fields:\n")
                        for field in other_fields:
                            f.write(f"  {field}\n")

                    f.write("\n----------\n\n")

                f.write("\n==========================\n\n")

            print(f"Sample data saved to scrape_data.txt")
    except Exception as e:
        print(f"Error saving sample data to file: {e}")
