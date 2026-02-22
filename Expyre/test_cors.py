import httpx
import asyncio
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_cors():
    response = client.options("/generate-email", headers={
        "Origin": "https://expyre.pages.dev",
        "Access-Control-Request-Method": "GET"
    })
    
    print("OPTIONS status:", response.status_code)
    print("OPTIONS headers:", response.headers)

    response = client.get("/generate-email", headers={
        "Origin": "https://expyre.pages.dev"
    })
    
    print("GET status:", response.status_code)
    print("GET headers:", response.headers)

if __name__ == "__main__":
    test_cors()
