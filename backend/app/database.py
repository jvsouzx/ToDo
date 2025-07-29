from sqlmodel import SQLModel, create_engine, Session

engine = create_engine("postgresql+psycopg2://postgres:postgres@localhost:5432/app", echo=True)

def get_session() -> Session:
    return Session(engine)

def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)