from datetime import timedelta, datetime, timezone
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from dotenv import load_dotenv
import os
from models import User
from deps import db_dependency, bcrypt_context

# Load environment variables from a .env file
load_dotenv()

# Create a new FastAPI router for authentication-related endpoints
router = APIRouter(
    prefix='/auth',  # URL prefix for routes in this router
    tags=['auth']  # Tag for grouping routes in API documentation
)

# Retrieve secret key and algorithm for JWT from environment variables
SECRET_KEY = os.getenv("AUTH_SECRET_KEY")
ALGORITHM = os.getenv("AUTH_ALGORITHM")

# Define request schema for creating a new user
class UserCreateRequest(BaseModel):
    username: str
    password: str

# Define response schema for JWT token
class Token(BaseModel):
    access_token: str
    token_type: str
    

# Function to authenticate a user based on username and password    
def authenticate_user(username: str, password: str, db):
    # Query the database for a user with the given username
    user = db.query(User).filter(User.username == username).first()
    # Check if the user exists and if the password is correct
    if not user:
        return False
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user

# Function to create a JWT access token
def create_access_token(username: str, user_id: int, expires_delta: timedelta):
    # Define the payload with user information and expiration time
    encode = {'sub': username, 'id': user_id}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({'exp': expires})
    # Encode the payload into a JWT token
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

# Endpoint to create a new user
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, create_user_request: UserCreateRequest):
    # Create a new User instance with hashed password
    create_user_model = User(
        username=create_user_request.username,
        hashed_password=bcrypt_context.hash(create_user_request.password)
    )
    # Add the new user to the database and commit the transaction
    db.add(create_user_model)
    db.commit()

# Endpoint to log in and obtain an access token
@router.post('/token', response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
                                 db: db_dependency):
    # Authenticate the user using the provided form data
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        # Raise an HTTP 401 error if authentication fails
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user")
    # Create a JWT token for the authenticated user
    token = create_access_token(user.username, user.id, timedelta(minutes=20))
    
    # Return the token in the response
    return {'access_token': token, 'token_type': 'bearer'}
    