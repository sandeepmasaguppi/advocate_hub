# ============================================================
#  main.py  —  AdvocateHub FastAPI & SlowAPI Rate Limiting Server
#  Folder:  AdvocateHub/chatbot/main.py
#  Run:     python main.py
#           or: uvicorn main:app --port 5001 --reload
#  Port:    5001  (server.js uses 5000)
# ============================================================

import sys
import os
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from typing import Optional
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from bot import get_response, get_advocates, format_advocate_card, logger

# 1. Initialize Rate Limiter based on Client IP address
limiter = Limiter(key_func=get_remote_address)

# 2. Custom 429 Handler (Exact pattern from reel)
def custom_rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={
            "status": 429,
            "error": "Too Many Requests 🚨",
            "message": f"Rate limit exceeded: {exc.detail}",
            "action": "Please slow down and try again later!"
        }
    )

# 3. Create FastAPI App
app = FastAPI(
    title="AdvocateHub AI Chatbot & Rate Limited API",
    description="High-performance asynchronous API with SlowAPI IP rate limiting",
    version="2.0.0"
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, custom_rate_limit_handler)

# Requests from the frontend normally reach this service through the Node API.
allowed_origins = [
    origin.strip()
    for origin in os.environ.get("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request body schema for /chat
class ChatRequest(BaseModel):
    message: str = ""
    lang: str = "en"


# ── Health check ───────────────────────────────────────────────
@app.get("/")
@limiter.limit("60/minute")
async def home(request: Request):
    return {
        "status": "AdvocateHub FastAPI Chatbot running ✅",
        "port": 5001,
        "framework": "FastAPI + SlowAPI Rate Limiting ⚡",
        "advocatesCount": len(get_advocates()),
    }

@app.get("/health")
async def health():
    return {"ok": True}


# ── 4. Rate Limited Demo Endpoint (5 requests per minute, matching reel) ──
@app.get("/hello")
@limiter.limit("5/minute")
async def hello(request: Request):
    return {
        "status": 200,
        "message": "Hello from FastAPI with SlowAPI rate limiting! 🚀",
        "client_ip": get_remote_address(request),
        "limit": "Max 5 requests per minute allowed."
    }


# ── Main chat endpoint (Rate limited to 30 requests per minute) ─
@app.post("/chat")
@limiter.limit("30/minute")
async def chat(request: Request, body: Optional[ChatRequest] = None):
    # Support both JSON body and raw dictionary payload
    if body is None:
        try:
            raw = await request.json()
            message = str(raw.get("message", "")).strip()
            lang = str(raw.get("lang", "en")).strip()
        except Exception:
            message, lang = "", "en"
    else:
        message = body.message.strip()
        lang = body.lang.strip()

    if not message:
        return JSONResponse(
            status_code=400,
            content={
                "text": "Please type or speak a message.",
                "type": "text",
            }
        )

    try:
        result = get_response(message, lang=lang)
        return JSONResponse(status_code=200, content=result)
    except Exception as e:
        logger.error(f"Chat error: {e}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={
                "text": "Sorry, something went wrong. Please try again.",
                "type": "text",
                "error": str(e),
            }
        )


# ── Advocates list endpoint (live queries, rate limited to 60/min) ─
@app.get("/advocates")
@limiter.limit("60/minute")
async def advocates(
    request: Request,
    city: str = "",
    spec: str = "",
    name: str = "",
    limit: int = 10
):
    city_q = city.strip().lower()
    spec_q = spec.strip().lower()
    name_q = name.strip().lower()

    results = get_advocates()
    if city_q:
        results = [
            a for a in results
            if city_q in (a.get("city") or "").lower()
            or city_q in (a.get("district") or "").lower()
            or city_q in (a.get("taluk") or "").lower()
        ]
    if spec_q:
        results = [
            a for a in results
            if spec_q in (a.get("speciality") or "").lower()
            or spec_q in (a.get("practiceArea") or "").lower()
        ]
    if name_q:
        results = [a for a in results if name_q in (a.get("name") or "").lower()]

    return {
        "count": len(results),
        "advocates": [format_advocate_card(a) for a in results[:limit]],
    }


if __name__ == "__main__":
    import uvicorn
    print("\n🚀 AdvocateHub FastAPI running with SlowAPI Rate Limiting -> http://localhost:5001\n")
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.environ.get("PORT", "5001")))
