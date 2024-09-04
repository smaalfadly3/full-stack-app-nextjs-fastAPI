from pydantic import BaseModel
from typing import List, Optional
from fastapi import APIRouter
from sqlalchemy.orm import joinedload
from models import Workout, Routine
from deps import db_dependency, user_dependency

# Create a new FastAPI router for routine-related endpoints
router = APIRouter(
    prefix='/routines', # URL prefix for routes in this router
    tags=['routines'] # Tag for grouping routes in API documentation
)

# Base model for Routine, defines the schema for routine data
class RoutineBase(BaseModel):
    name: str
    description: Optional[str] = None
    
# Model for creating a new routine, extends RoutineBase
class RoutineCreate(RoutineBase):
    workouts: List[int] = [] # List of workout IDs associated with this routine

 # Endpoint to retrieve all routines for the current user   
@router.get("/")
def get_routines(db: db_dependency, user: user_dependency):
    return db.query(Routine).options(joinedload(Routine.workouts)).filter(Routine.user_id == user.get('id')).all()

# Endpoint to create a new routine
@router.post("/")
def create_routine(db: db_dependency, user: user_dependency, routine: RoutineCreate):
    db_routine = Routine(name=routine.name, description=routine.description, user_id=user.get('id'))
    for workout_id in routine.workouts:
        workout = db.query(Workout).filter(Workout.id == workout_id).first()
        if workout:
            db_routine.workouts.append(workout)
    db.add(db_routine)
    db.commit()
    db.refresh(db_routine)
    # Return the created routine with its associated workouts
    db_routines = db.query(Routine).options(joinedload(Routine.workouts)).filter(Routine.id == db_routine.id).first()
    return db_routines

# Endpoint to delete a routine by its ID
@router.delete('/')
def delete_routine(db: db_dependency, user: user_dependency, routine_id: int):
    db_routine = db.query(Routine).filter(Routine.id == routine_id).first()
    if db_routine:
        # If the routine exists, delete it from the database and commit the transaction
        db.delete(db_routine)
        db.commit()
    return db_routine # Return the deleted routine or None if not found