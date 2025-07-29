from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, timezone

class Task(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True, index=True)
    title: str
    description: Optional[str] = None
    status: str = Field(default="pending")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    due_date: Optional[datetime] = None
    priority: int = Field(default=0)