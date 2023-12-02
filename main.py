import os, json, re
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm 
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic_settings import BaseSettings
from pydantic import BaseModel, Field
from passlib.context import CryptContext
from jose import jwt
from datetime import timedelta
from core.schemas import UserSchema, UserLoginSchema, TokenSchema, TokenDataSchema
from fastapi.middleware.cors import CORSMiddleware
from typing import Union, Annotated

from core.utils import (
    get_hashed_password, 
    verify_password,
    create_jwt_token
)

from core.config import Base, engine, SessionLocal
from core.models import User, File

hash_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="signin")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

async def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all HTTP headers
)

Base.metadata.create_all(bind=engine)

async def user_exists(db: Session = Depends(get_db), user_email: str = None):
    user = db.query(User).filter_by(email=user_email).first()
    return user is not None

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credential_exception = HTTPException(status_code=401, detail="Couldn't validate credentials")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("email")
        if email is None:
            raise credential_exception
        
    except jwt.JWTError:
        raise credential_exception

    if not user_exists(user_email = email):
        raise credential_exception
    return payload

@app.get("/clear_users")
async def clear_users(db: Session = Depends(get_db)):
    db.query(User).delete()
    db.commit()

@app.post("/signup")
async def signup(db: Session = Depends(get_db), user_data: UserSchema = None):
    password_regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
    email_regex = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"
    username_regex = r"^(?=.*[a-zA-Z])(?=.*[\d\W]).{6,}$"

    if not re.match(password_regex, user_data.password):
        raise HTTPException(status_code=400, detail="Password is not secure")

    if not re.match(email_regex, user_data.email):
        raise HTTPException(status_code=400, detail="Invalid email")

    if not re.match(username_regex, user_data.username):
        raise HTTPException(status_code=400, detail="Your username must contain at least one letter, one number or special character, and be at least 6 characters long")

    check_user = db.query(User).filter_by(email=user_data.email).first()
    if check_user is not None:
        raise HTTPException(status_code=400, detail="Email already registered")

    db_user = User(
        username = user_data.username,
        email = user_data.email,
        password = get_hashed_password(user_data.password),
        disabled = False
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    expire_mins = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_jwt_token(user_data.email, expire_mins)
    token_schema = TokenSchema(access_token=token, token_type="bearer")
    return token_schema

@app.post('/signin', response_model=TokenSchema)
# async def signin(db: Session = Depends(get_db), user_data: OAuth2PasswordRequestForm = None):
async def signin(db: Session = Depends(get_db), user_data: UserLoginSchema = None):
    user = db.query(User).filter_by(email=user_data.email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    password_valid = verify_password(user_data.password, user.password)
    if not password_valid:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    expire_mins = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_jwt_token(user.email, expire_mins)
    token_schema = TokenSchema(access_token=token, token_type="bearer")
    return token_schema

@app.post("/uploadfile")
# async def upload_file(token: Annotated[str, Form()], file: Annotated[bytes, Form()], db: Session = Depends(get_db)):
async def upload_file(token: Annotated[str, Form()], 
    file: Annotated[bytes, File()],
    fileb: Annotated[UploadFile, File()],
    db: Session = Depends(get_db)):
    # form_obj = json.loads(token)
    # print(token)
    # user = get_current_user()
    # print(form_obj)
    # content = await file.read()
    # db_file = File(name="file 2", binary_data=content)
    # db.add(db_file)
    # db.commit()
    return {"status": "uploaded successfully"}

@app.get("/test")
def test(db: Session = Depends(get_db), dependencies = Depends(get_current_user)):
    print(dependencies)