from contextlib import asynccontextmanager
from fastapi import Body, FastAPI, Depends, HTTPException
from sqlmodel import Session, select
from app.models import Task
from app.database import create_db_and_tables, get_session
import logging
from fastapi.middleware.cors import CORSMiddleware

logger = logging.getLogger("uvicorn")


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to the Task Management API"}


@app.get("/tasks")
def list_tasks(session: Session = Depends(get_session)) -> list[Task]:
    tasks = session.exec(select(Task)).all()
    return tasks

@app.get("/tasks/{task_id}")
def get_task_by_id(task_id: int, session: Session = Depends(get_session)) -> Task:
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.post("/tasks")
def create_task(
    task: Task = Body(...), session: Session = Depends(get_session)
) -> Task:
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@app.put("/tasks/{task_id}")
def update_task(
    task_id: int, updated_task: Task = Body(...), session: Session = Depends(get_session)
) -> Task:
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.title = updated_task.title
    task.description = updated_task.description
    task.status = updated_task.status
    task.due_date = updated_task.due_date
    task.priority = updated_task.priority
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, session: Session = Depends(get_session)) -> None:
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    session.delete(task)
    session.commit()
