import argparse

import firebase_admin
from firebase_admin import credentials, firestore


def init_firebase_admin():
    if not firebase_admin._apps:
        cred = credentials.Certificate("./firebase-service-account.json")
        firebase_admin.initialize_app(cred)
    return firestore.client()


# db = init_firebase_admin()

# events_ref = db.collection("events")
# docs = events_ref.stream()

# print("Events in database:")
# print("")
# for doc in docs:
#     event_data = doc.to_dict()
#     print(f"Document ID: {doc.id}")
#     print(f"Name: {event_data.get('name')}")
#     print(f"Location: {event_data.get('location')}")
#     print(f"Date: {event_data.get('date')}")
#     print(f"Categories: {event_data.get('category')}")
#     print("")

# events_count = len(list(events_ref.stream()))
# print(f"Total events found: {events_count}")


class FirebaseOperations:
    def __init__(self, credential_path="./firebase-service-account.json"):
        if not firebase_admin._apps:
            cred = credentials.Certificate(credential_path)
            firebase_admin.initialize_app(cred)
        self.db = firestore.client()
        self.events_ref = self.db.collection("events")

    def check_firebase(self):
        docs = self.events_ref.stream()

        print("Events in database:")
        print("")
        for doc in docs:
            event_data = doc.to_dict()
            print(f"Document ID: {doc.id}")
            print(f"Name: {event_data.get('name')}")
            print(f"Location: {event_data.get('location')}")
            print(f"Date: {event_data.get('date')}")
            print(f"Categories: {event_data.get('category')}")
            print("")

        events_count = len(list(self.events_ref.stream()))
        print(f"Total events found: {events_count}")
        return events_count

    # NOTE: delete later maybe, need now when schema and stuff changing a lot
    def empty_firebase_events(self):
        try:
            docs = self.events_ref.stream()

            batch = self.db.batch()
            count = 0

            for doc in docs:
                batch.delete(self.events_ref.document(doc.id))
                count += 1

            if count > 0:
                batch.commit()
                print(f"Successfully deleted {count} events from database")
            else:
                print("No events found to delete")

            return count

        except Exception as e:
            print(f"Error emptying Firebase events: {e}")
            return 0


"""
to mimic node command calling
easier
Start venv and run these
python3 FirebaseOperations.py check
python3 FirebaseOperations.py check
"""
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Firebase Operations")
    parser.add_argument(
        "operation",
        choices=["check", "empty_events"],
        help="Operation to perform (check: view events, empty: delete all events)",
    )

    args = parser.parse_args()

    firebase_ops = FirebaseOperations()

    if args.operation == "check":
        firebase_ops.check_firebase()
    elif args.operation == "empty_events":
        confirmation = input("Are you sure, DELETING ALL EVENTS?! (yes/no): ")
        if confirmation.lower() == "yes":
            firebase_ops.empty_firebase_events()
        else:
            print("Operation cancelled.")
