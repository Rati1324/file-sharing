import os
from passlib.context import CryptContext
from jose import jwt, ExpiredSignatureError, JWTError
from dotenv import load_dotenv
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException
from .models import User, File as File_Model
from .config import Base, engine, SessionLocal

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
EXPIRATION_MINUTES = os.getenv("EXPIRATION_MINUTE")

credential_exception = HTTPException(status_code=401, detail="Couldn't validate credentials")
hash_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def get_hashed_password(password: str) -> str:
    return hash_context.hash(password)

def verify_password(password: str, hashed_pass: str) -> bool:
    return hash_context.verify(password, hashed_pass)

def create_jwt_token(sub: str, expires_delta: timedelta | None = None):
    expire = datetime.utcnow() + expires_delta
    data = {"email": sub, "exp": expire}
    jwt_token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return jwt_token

def get_current_user(db: Session, token: str = None):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email: str = payload.get("email")

        if payload["email"] is None:
            raise crendential_exception

        user = db.query(User).filter_by(email=user_email).first()
        if user is None:
            raise credential_exception

        payload["user_id"] = user.id
        return payload
    except jwt.JWTError:
        raise credential_exception

def user_exists(db: Session, user_email: str = None):
    user = db.query(User).filter_by(email=user_email).first()
    print(user)
    return user is not None