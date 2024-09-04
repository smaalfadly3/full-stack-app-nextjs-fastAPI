from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, workouts
# , routines

from database import Base, engine

# Create an instance of the FastAPI class
app=FastAPI()

# Create all tables in the database using SQLAlchemy's Base metadata
Base.metadata.create_all(bind=engine)

# Add CORS middleware to handle cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'], # Allow requests from this origin
     allow_credentials=True, # Allow cookies and other credentials to be included in requests
     allow_methods=['*'], # Allow all HTTP methods
     allow_headers=['*'] # Allow all headers
)

# Define a health check endpoint
@app.get("/")
def health_check():
    return 'Health check complete'

# Include the auth router to handle authentication-related endpoints
app.include_router(auth.router)
app.include_router(workouts.router)
# app.include_router(routines.router)