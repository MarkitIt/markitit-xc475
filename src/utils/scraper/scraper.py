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

collection_name = "events"


def scrape_eventeny():

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
        print(soup)

        event = []

    except:
        print("Error: ", e)
        return []


scrape_eventeny()
