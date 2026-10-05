FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY main.py bot.py app.py ./

EXPOSE 5001
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-5001}"]
