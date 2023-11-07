import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm 
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic_settings import BaseSettings
from pydantic import BaseModel, Field
from passlib.context import CryptContext
from jose import jwt
from datetime import timedelta
from core.schemas import UserSchema, TokenSchema, TokenDataSchema

from core.utils import (
    get_hashed_password, 
    verify_password,
    create_jwt_token
)

from core.config import Base, engine, SessionLocal
from core.models import User

hash_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

app = FastAPI()
Base.metadata.create_all(bind=engine)

@app.get("/clear_users")
async def clear_users(db: Session = Depends(get_db)):
    db.query(User).delete()
    db.commit()

@app.get("/")
async def test():
    return {"message": "hi4"}

@app.post("/signup")
async def signup(db: Session = Depends(get_db), user_data: UserSchema = None):
    check_user = db.query(User).filter_by(username=user_data.username).first()
    if check_user is not None:
        raise HTTPException(status_code=400, detail="Username already registered")

    db_user = User(
        username = user_data.username,
        password = get_hashed_password(user_data.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    expire_mins = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_jwt_token(user_data.username, expire_mins)
    token_schema = TokenSchema(access_token=token, token_type="bearer")
    return token_schema

@app.post('/signin', response_model=TokenSchema)
async def signin(db: Session = Depends(get_db), user_data: UserSchema = None):
    user = db.query(User).filter_by(username=user_data.username).first().password

    # if user is None:
    #     raise exception.HTTPException(status_code=400, detail="Invalid username of password")

    # password_valid = verify_password(user_data.password, user)
    # print(password_valid)
    return {"response": "user successfully logged in"}

def find_user(db: Session = Depends(get_db), username: str or None=None):
    user = db.query(User).filter_by(username=username).first().password
    return user is None

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credential_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Couldn't validate credentials")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithm=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credential_exception
        
        # token_data = TokenData(username=username)

    except jwt.JWTError:
        raise credential_exception

    if find_user(username) is None:
        raise credential_exception
    
    return user

