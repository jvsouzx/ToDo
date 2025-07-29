from fastapi.testclient import TestClient
from app.main import app
from app.database import create_db_and_tables
from sqlmodel import SQLModel
from unittest.mock import patch

client = TestClient(app)


def test_list_tasks():
    response = client.get("/tasks")
    assert response.status_code == 200

def test_get_task_by_id():
    response = client.get("/tasks/1")
    # Assuming no task with ID 1 exists initially
    assert response.status_code == 404

def test_create_task():
    response = client.post(
        "/tasks",
        json={
            "title": "Test Task",
            "description": "This is a test task",
            "status": "pending",
            "due_date": "2023-12-31T23:59:59Z",
            "priority": 1,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["status"] == "pending"


def test_update_task():
    create_response = client.post(
        "/tasks",
        json={
            "title": "Task to Update",
            "description": "This task will be updated",
            "status": "pending",
        },
    )
    task_id = create_response.json()["id"]

    response = client.put(
        f"/tasks/{task_id}",
        json={
            "title": "Updated Task",
            "description": "This task has been updated",
            "status": "completed",
            "due_date": None,
            "priority": 2,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Task"
    assert data["status"] == "completed"

def test_update_non_existent_task():
    response = client.put(
        "/tasks/9999",
        json={
            "title": "Non-existent Task",
            "description": "This task does not exist",
            "status": "pending",
        },
    )
    assert response.status_code == 404

def test_delete_task():
    create_response = client.post(
        "/tasks",
        json={
            "title": "Task to Delete",
            "description": "This task will be deleted",
            "status": "pending",
            "priority": 1,
        },
    )
    task_id = create_response.json()["id"]
    response = client.delete(f"/tasks/{task_id}")
    assert response.status_code == 200
    get_response = client.get(f"/tasks/{task_id}")
    assert get_response.status_code == 404

def test_delete_non_existent_task():
    response = client.delete("/tasks/9999")
    assert response.status_code == 404

def test_create_db_and_tables():
    with patch.object(SQLModel.metadata, "create_all") as mock_create_all:
        create_db_and_tables()
        mock_create_all.assert_called_once()