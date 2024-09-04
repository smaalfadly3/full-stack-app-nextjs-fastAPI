from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base

# Define an association table for the many-to-many relationship between Workout and Routine.
# This table has two foreign keys that reference the primary keys of the workouts and routines tables.
workout_routine_association = Table(
    'workout_routine', Base.metadata,
    Column('workout_id', Integer, ForeignKey('workouts.id')),
    Column('routine_id', Integer, ForeignKey('routines.id'))
)

# Define the User model, which represents a user in the database.
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
# Define the Workout model, which represents a workout in the database.
class Workout(Base):
    __tablename__ = 'workouts'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    name = Column(String, index=True)
    description = Column(String, index=True)
        # Define a many-to-many relationship with the Routine model
    routines = relationship('Routine', secondary=workout_routine_association, back_populates='workouts')
    
# Define the Routine model, which represents a routine in the database.
class Routine(Base):
    __tablename__ = 'routines'
    id = Column(Integer, primary_key=True, index=True )
    user_id = Column(Integer, ForeignKey('users.id'))
    name = Column(String, index=True)
    description = Column(String, index=True)
        # Define a many-to-many relationship with the Workout model

    workouts = relationship('Workout', secondary=workout_routine_association, back_populates='routines')

# Define the back_populates on the Workout model to complete the bidirectional relationship
Workout.routines = relationship('Routine', secondary=workout_routine_association, back_populates='workouts')