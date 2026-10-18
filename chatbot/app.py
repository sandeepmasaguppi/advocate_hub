# ============================================================
#  app.py  —  AdvocateHub Python Flask Chatbot Backend Server
#  Folder:  AdvocateHub/chatbot/app.py
#  Run:     python app.py
#  Port:    5001 (or process.env.PORT)
# ============================================================

import os
import sys
import logging

# Ensure UTF-8 output encoding
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("AdvocateHubFlaskChatbot")

from bot import get_response, get_advocates, format_advocate_card

# Attempt Flask import (Primary Flask Backend)
try:
    from flask import Flask, request, jsonify, make_response
    from flask_cors import CORS
    HAS_FLASK = True
except ImportError:
    HAS_FLASK = False
    logger.warning("Flask or flask_cors not found. Will provide fallback runner.")

if HAS_FLASK:
    app = Flask(__name__)

    # Configure CORS for all frontend origins (Localhost, Railway, production domains)
    CORS(
        app,
        resources={
            r"/*": {
                "origins": "*",
                "methods": ["GET", "POST", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"]
            }
        }
    )

    @app.after_request
    def set_security_and_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"
        response.headers["X-Content-Type-Options"] = "nosniff"
        return response

    @app.route("/", methods=["GET"])
    def index():
        return jsonify({
            "status": "AdvocateHub Flask Chatbot running ✅",
            "port": int(os.environ.get("PORT", "5001")),
            "framework": "Flask + CORS ⚡",
            "advocatesCount": len(get_advocates()),
        }), 200

    @app.route("/health", methods=["GET"])
    def health():
        return jsonify({
            "ok": True,
            "status": "healthy",
            "service": "AdvocateHub Chatbot Flask API",
        }), 200

    @app.route("/hello", methods=["GET"])
    def hello():
        return jsonify({
            "status": 200,
            "message": "Hello from AdvocateHub Flask Chatbot! 🚀",
        }), 200

    @app.route("/chat", methods=["POST", "OPTIONS"])
    def chat_endpoint():
        if request.method == "OPTIONS":
            return make_response("", 204)

        try:
            data = request.get_json(silent=True) or {}
        except Exception:
            data = {}

        message = str(data.get("message", "")).strip()
        lang = str(data.get("lang", "en")).strip()

        # 1. Reject empty message
        if not message:
            return jsonify({
                "text": "Please type or speak a message.",
                "type": "text"
            }), 400

        # 2. Reject excessively long messages (prevent denial of service)
        if len(message) > 2000:
            return jsonify({
                "text": "Message is too long. Please keep your question under 2000 characters.",
                "type": "text"
            }), 400

        # 3. Process natural greetings and legal queries
        try:
            result = get_response(message, lang=lang)
            return jsonify(result), 200
        except Exception as e:
            logger.error(f"Chatbot execution error: {e}", exc_info=True)
            return jsonify({
                "text": "Sorry, something went wrong while processing your request. Please try again.",
                "type": "text",
                "error": str(e)
            }), 500

    @app.route("/advocates", methods=["GET"])
    def get_advocates_endpoint():
        city_q = request.args.get("city", "").strip().lower()
        spec_q = request.args.get("spec", "").strip().lower()
        name_q = request.args.get("name", "").strip().lower()

        try:
            limit = int(request.args.get("limit", 10))
        except (ValueError, TypeError):
            limit = 10

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

        return jsonify({
            "count": len(results),
            "advocates": [format_advocate_card(a) for a in results[:limit]]
        }), 200

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Endpoint not found", "status": 404}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal server error", "status": 500}), 500

else:
    # If Flask is not installed, provide compatibility with FastAPI from main.py
    from main import app as fastapi_app
    app = fastapi_app


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5001"))
    if HAS_FLASK:
        print(f"\n🚀 AdvocateHub Flask Chatbot running -> http://0.0.0.0:{port}\n")
        app.run(host="0.0.0.0", port=port, debug=False)
    else:
        import uvicorn
        print(f"\n🚀 AdvocateHub FastAPI running -> http://0.0.0.0:{port}\n")
        uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)