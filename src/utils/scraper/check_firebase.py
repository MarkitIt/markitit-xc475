import firebase_admin
from firebase_admin import credentials, firestore


def init_firebase_admin():
    if not firebase_admin._apps:
        cred = credentials.Certificate("./firebase-service-account.json")
        firebase_admin.initialize_app(cred)
    return firestore.client()


db = init_firebase_admin()

events_ref = db.collection("events")
docs = events_ref.stream()

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

events_count = len(list(events_ref.stream()))
print(f"Total events found: {events_count}")
