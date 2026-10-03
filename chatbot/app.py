# ============================================================
#  app.py  —  AdvocateHub FastAPI & SlowAPI Rate Limiting Runner
#  Folder:  AdvocateHub/chatbot/app.py
#  Run:     python app.py
#           or: python main.py
#  Port:    5001
# ============================================================

from main import app

if __name__ == "__main__":
    import uvicorn
    print("\n🚀 AdvocateHub FastAPI running with SlowAPI Rate Limiting -> http://localhost:5001\n")
    uvicorn.run("main:app", host="0.0.0.0", port=5001, reload=True)