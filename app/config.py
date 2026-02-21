import os
from dotenv import load_dotenv

load_dotenv()

WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET")

RATE_LIMIT = int(os.getenv("RATE_LIMIT", 30))
RATE_WINDOW = int(os.getenv("RATE_WINDOW", 60))
EMAIL_EXPIRY_MINUTES = int(os.getenv("EMAIL_EXPIRY_MINUTES", 10))
