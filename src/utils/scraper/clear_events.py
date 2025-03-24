import firebase_admin
from firebase_admin import credentials, firestore


def init_firebase_admin():
    if not firebase_admin._apps:
        cred = credentials.Certificate("./firebase-service-account.json")
        firebase_admin.initialize_app(cred)
    return firestore.client()


db = init_firebase_admin()


def clear_events():
    events_ref = db.collection("events")

    docs = events_ref.stream()

    count = 0
    for doc in docs:
        doc.reference.delete()
        count += 1
        if count % 100 == 0:
            print(f"Deleted {count} documents...")

    print(f"Successfully deleted {count} documents from events collection")


if __name__ == "__main__":
    print("Clearing events collection...")
    clear_events()
    print("Done!")
