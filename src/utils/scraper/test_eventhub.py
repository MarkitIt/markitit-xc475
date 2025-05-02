import requests
from bs4 import BeautifulSoup
from scraper import scrape_eventhub


def test_eventhub_with_debug():
    print("Testing EventHub scraper with enhanced debugging...")

    def check_url_directly():
        headers = {
            "User-Agent": "Mozilla/5.0 (X11; U; Linux i686; en-US) AppleWebKit/534.3 (KHTML, like Gecko) Chrome/6.0.472.63 Safari/534.3"
        }

        base_url = "https://eventhub.net/marketplace"

        regions = ["SOUTH - E"]
        url_regions = "%2C".join([region.replace(" ", "%20") for region in regions])

        search_url = (
            f"{base_url}?keyword=market&region={url_regions}&currentPage=1&pageSize=20"
        )

        print(f"Testing direct access to URL: {search_url}")

        try:
            response = requests.get(search_url, headers=headers, timeout=15)
            print(f"Response status code: {response.status_code}")

            if response.status_code == 200:
                with open("eventhub_response.html", "w", encoding="utf-8") as f:
                    f.write(response.text)
                print("Saved HTML response to eventhub_response.html")

                soup = BeautifulSoup(response.content, "html.parser")

                mb10_divs = soup.select("div.mb-10")
                print(f"Found {len(mb10_divs)} div.mb-10 elements")

                # Check for event items
                event_items = soup.select("div.mb-10 a.relative.flex")
                print(
                    f"Found {len(event_items)} event items using div.mb-10 a.relative.flex"
                )

                alt_event_items = soup.select("a.relative.flex")
                print(
                    f"Found {len(alt_event_items)} event items using just a.relative.flex"
                )

                all_links = soup.find_all("a")
                print(f"Found {len(all_links)} total links on the page")

                marketplace_elements = soup.select("[data-testid='marketplace']")
                print(f"Found {len(marketplace_elements)} marketplace elements")

                return True
            else:
                print("Failed to access the URL directly")
                return False
        except Exception as e:
            print(f"Error accessing URL directly: {e}")
            return False

    url_accessible = check_url_directly()

    if not url_accessible:
        print(
            "URL test failed. The website might be blocking scrapers or the URL structure has changed."
        )
        return

    eventhub_events = scrape_eventhub()

    print(f"Found {len(eventhub_events)} EventHub events")

    try:
        with open("eventhub_test_data.txt", "w") as f:
            f.write("EVENTHUB TEST RESULTS\n")
            f.write("====================\n\n")

            f.write(f"Number of events found: {len(eventhub_events)}\n\n")

            for i, event in enumerate(eventhub_events):
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

            print(f"Test data saved to eventhub_test_data.txt")
    except Exception as e:
        print(f"Error saving test data to file: {e}")


if __name__ == "__main__":
    test_eventhub_with_debug()
