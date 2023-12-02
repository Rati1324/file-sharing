import os
from passlib.context import CryptContext
from jose import jwt
from dotenv import load_dotenv
from datetime import datetime, timedelta
import re

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
EXPIRATION_MINUTES = os.getenv("EXPIRATION_MINUTER")

hash_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_hashed_password(password: str) -> str:
    return hash_context.hash(password)

def verify_password(password: str, hashed_pass: str) -> bool:
    return hash_context.verify(password, hashed_pass)

def create_jwt_token(sub: str, expires_delta: timedelta | None = None):
    expire = datetime.utcnow() + expires_delta
    data = {"email": sub, "exp": expire}
    jwt_token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return jwt_token