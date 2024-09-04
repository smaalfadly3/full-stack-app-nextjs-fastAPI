from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import jwt, JWTError
from dotenv import load_dotenv
import os
from database import SessionLocal

# Load environment variables from a .env file
load_dotenv()

# Retrieve secret key and algorithm for JWT from environment variables
SECRET_KEY = os.getenv('AUTH_SECRET_KEY')
ALGORITHM = os.getenv('AUTH_ALGORITHM')

# Dependency function to get a database session
def get_db():
    # Create a new session instance
    db = SessionLocal()
    try:
        # Yield the session instance for use in endpoints
        yield db
    finally:
        # Ensure the session is closed after use
        db.close()
        
# Annotated type for dependency injection of a database session
db_dependency = Annotated[Session, Depends(get_db)]

# Create a CryptContext object for hashing passwords with bcrypt
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

# Define the OAuth2 password bearer scheme for token authentication
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')

# Annotated type for dependency injection of the OAuth2 token
oauth2_bearer_dependency = Annotated[str, Depends(oauth2_bearer)]


# Dependency function to get the current user from the JWT token
async def get_current_user(token: oauth2_bearer_dependency):
    try:
        # Decode the JWT token using the secret key and algorithm
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        user_id: int = payload.get('id')
        # Check if username and user_id are present in the payload
        if username is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user')
        return {'username': username, 'id': user_id}
    except JWTError:
        # Handle JWT decoding errors
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user')
    
# Annotated type for dependency injection of the current user
user_dependency = Annotated[dict, Depends(get_current_user)]