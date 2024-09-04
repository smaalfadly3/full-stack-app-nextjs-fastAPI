from pydantic import BaseModel
from typing import Optional
from fastapi import APIRouter, status

from api.models import Workout
from api.deps import db_dependency, user_dependency

# Create a new FastAPI router for workout-related endpoints
router = APIRouter(
    prefix='/workouts', # URL prefix for routes in this router
    tags=['workouts'] # Tag for grouping routes in API documentation
)

# Base model for Workout, defines the schema for workout data
class WorkoutBase(BaseModel):
    name: str
    description: Optional[str] = None
    
# Model for creating a new workout, extends WorkoutBase
class WorkoutCreate(WorkoutBase):
    pass


# Endpoint to retrieve a single workout by its ID
@router.get('/')
def get_workout(db: db_dependency, user: user_dependency, workout_id: int):
    return db.query(Workout).filter(Workout.id == workout_id).first()

# Endpoint to retrieve all workouts
@router.get('/workouts')
def get_workouts(db: db_dependency, user: user_dependency):
    return db.query(Workout).all()

# Endpoint to create a new workout
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_workout(db: db_dependency, user: user_dependency, workout: WorkoutCreate):
    # Create a new Workout instance with the provided data and the user's ID
    db_workout = Workout(**workout.model_dump(), user_id=user.get('id'))
    # Add the new workout to the database and commit the transaction
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout) # Refresh to get the latest state from the database
    return db_workout # Return the created workout

# Endpoint to delete a workout by its ID
@router.delete("/")
def delete_workout(db: db_dependency, user: user_dependency, workout_id: int):
    # If the workout exists, delete it from the database and commit the transaction
    db_workout = db.query(Workout).filter(Workout.id == workout_id).first()
    if db_workout:
        db.delete(db_workout)
        db.commit()
    return db_workout # Return the deleted workout or None if not found