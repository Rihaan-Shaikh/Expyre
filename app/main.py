
import random
import string
import asyncio
import logging
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException


from app.config import (
    WEBHOOK_SECRET,
    RATE_LIMIT,
    RATE_WINDOW,
    EMAIL_EXPIRY_MINUTES
)

from datetime import datetime, timedelta
from contextlib import asynccontextmanager #to run the dlt fnc in sync every second the server runs

from fastapi import FastAPI, Request, Header, HTTPException

from app.database import (
    create_tables,
    save_temp_email,
    get_temp_email,
    get_inbox_for_email,
    save_received_email,
    delete_expired_data

)
allowed_origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

logger = logging.getLogger("expyre")

rate_limit_store = {}
def check_rate_limit(request: Request):
    ip = request.client.host if request.client else "unknown"
    now = datetime.utcnow().timestamp()

    if ip not in rate_limit_store:
        rate_limit_store[ip] = []

    # keep only requests in last RATE_WINDOW seconds
    rate_limit_store[ip] = [
        t for t in rate_limit_store[ip]
        if now - t < RATE_WINDOW
    ]

    if len(rate_limit_store[ip]) >= RATE_LIMIT:
        logger.warning(f"Rate limit exceeded for IP {ip}")
        return False


    rate_limit_store[ip].append(now)
    return True


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Expyre backend")
    create_tables()
    asyncio.create_task(cleanup_loop())
    yield
    logger.info("Shutting down Expyre backend")

app = FastAPI(title="Expyre API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)







@app.get("/")

def root():
    return {
        "status":"ok",
        "message":"Expyre backend is alive"
    }

@app.get("/generate-email")
def generate_email(request: Request):

    if not check_rate_limit(request):
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please slow down."
        )

    username= ''.join(random.choices(string.ascii_lowercase+string.digits,k=8))
    email=f"{username}@expyre.com"

    created_at=datetime.utcnow()
    expires_at = created_at + timedelta(minutes=EMAIL_EXPIRY_MINUTES)


    save_temp_email(
       email=email,
       created_at=created_at.isoformat(),
       expires_at=expires_at.isoformat(),
    )


    return{
        "email":email,
        "expires_in_minutes":10
    }


@app.get("/temp-email/{email}")
def read_temp_email(email: str):
    record = get_temp_email(email)

    if record is None:
        return {"exists": False}

    email_value, created_at, expires_at = record

    now = datetime.utcnow()
    expires_at_dt = datetime.fromisoformat(expires_at)
    expired = now > expires_at_dt

    if expired:
        return {
            "exists": True,
            "email": email_value,
            "expired": True
        }

    return {
        "exists": True,
        "email": email_value,
        "created_at": created_at,
        "expires_at": expires_at,
        "expired": False
    }


@app.get("/inbox/{email}")
def read_inbox(email: str, request: Request):

    if not check_rate_limit(request):
        raise HTTPException(
        status_code=429,
        detail="Too many requests"
    )

    record = get_temp_email(email)

    if record is None:
        return {"email": email, "messages": []}

    _, _, expires_at = record
    now = datetime.utcnow()
    expired = now > datetime.fromisoformat(expires_at)

    if expired:
        return {"email": email, "messages": []}

    messages = get_inbox_for_email(email)

    inbox = []
    for msg in messages:
        inbox.append({
            "from": msg[0],
            "subject": msg[1],
            "body": msg[2],
            "received_at": msg[3]
        })

    return {
        "email": email,
        "messages": inbox
    }


@app.post("/simulate-email")
def simulate_email(
    to_email: str,
    from_email: str = "sender@example.com",
    subject: str = "Test Subject",
    body: str = "This is a test email body"
):
    received_at = datetime.utcnow().isoformat()

    save_received_email(
        to_email=to_email,
        from_email=from_email,
        subject=subject,
        body=body,
        received_at=received_at
    )

    return {"status": "saved"}

@app.post("/webhook/email")
def email_webhook(
    payload: dict,
    x_webhook_token: str = Header(None)
):
    if x_webhook_token != WEBHOOK_SECRET:
        logger.warning("Unauthorized webhook attempt")
        raise HTTPException(status_code=401, detail="Unauthorized webhook")

    to_email = payload.get("to")
    from_email = payload.get("from")
    subject = payload.get("subject", "")
    body = payload.get("text", "")

    if not to_email:
        return {"status": "ignored"}

    received_at = datetime.utcnow().isoformat()

    save_received_email(
        to_email=to_email,
        from_email=from_email,
        subject=subject,
        body=body,
        received_at=received_at
    )

    return {"status": "received"}
async def cleanup_loop():
    while True:
        now_iso = datetime.utcnow().isoformat()
        delete_expired_data(now_iso)

        # wait 60 seconds before next cleanup
        await asyncio.sleep(60)
        logger.info("Expired data cleanup executed")

