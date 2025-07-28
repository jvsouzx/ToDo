import traceback
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from sqlmodel import create_engine, text
import logging

logger = logging.getLogger("uvicorn")

engine = create_engine("postgresql+psycopg2://postgres:postgres@localhost:5432/app", echo=True)

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello World!"}

@app.get("/health")
def health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"status": "healthy"}
    except Exception:
        logger.error("Health check failed:\n%s", traceback.format_exc())
        return JSONResponse(content={"status": "unhealthy"}, status_code=500)