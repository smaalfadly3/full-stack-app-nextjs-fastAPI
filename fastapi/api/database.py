from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import  declarative_base
from sqlalchemy.orm import sessionmaker

# Define the URL for the SQLite database. The file 'workout_app.db' will be created in the current directory.
SQL_ALCHEMY_DATABASE_URL = 'sqlite:///workout_app.db'

# Create an engine that connects to the SQLite database specified by SQL_ALCHEMY_DATABASE_URL.
# The connect_args={'check_same_thread': False} is necessary for SQLite in multithreaded environments.
engine = create_engine(SQL_ALCHEMY_DATABASE_URL, connect_args={'check_same_thread': False})

# Create a configured "Session" class to interact with the database.
# Sessions are used to manage database transactions and queries.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a base class for declarative class definitions.
# Models will inherit from this base class.
Base = declarative_base()