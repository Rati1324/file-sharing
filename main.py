import os, json, re
import base64
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, Header
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
from starlette.responses import FileResponse
from io import BytesIO
from fastapi.responses import StreamingResponse

from core.utils import (
    create_jwt_token,
    get_hashed_password, 
    verify_password,
    get_current_user,
    user_exists,
    credential_exception,
)

from core.config import Base, engine, SessionLocal
from core.models import User, File as File_Model

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="signin")

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all HTTP headers
)

Base.metadata.create_all(bind=engine)

@app.post("/verify_token")
async def verify_token(db: Session = Depends(get_db), authorization: str = Header(default=None)):
    return get_current_user(db, authorization[7:])

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

    check_user = user_exists(db, user_data.email)
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
        raise HTTPException(status_code=401, detail="Invalid email or password")

    password_valid = verify_password(user_data.password, user.password)
    if not password_valid:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    expire_mins = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_jwt_token(user.email, expire_mins)
    token_schema = TokenSchema(access_token=token, token_type="bearer")
    return token_schema

@app.post("/upload_file")
async def upload_file(authorization: str = Header(default=None), file: UploadFile = File, db: Session = Depends(get_db)):
    token = authorization[7:]
    user = get_current_user(db, token)

    file_content = await file.read()
    if not user_exists(db, user["email"]):
        raise HTTPException(status_code=401, detail="Unauthorized")

    db_file = File_Model(
        name=file.filename,
        binary_data=file_content, 
        owner_id=user["user_id"]
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return {"status": "uploaded successfully"}

@app.get("/get_files")
async def get_files(authorization: str = Header(default=None), db: Session = Depends(get_db)):
    token = authorization[7:]
    user = get_current_user(db, token)
    if user is not None:
        user_id = db.query(User).filter_by(email=user["email"]).first().id

    files = db.query(File_Model).filter_by(owner_id=user_id).all()
    result = []
    for file in files:
        file_data_b64 = base64.b64encode(file.binary_data).decode('utf-8')
        result.append({
            "id": file.id,
            "name": file.name,
            "file_data": file_data_b64,
        })
    return {"result": result}

@app.delete("/delete_file/{file_id}")
async def delete_file(authorization: str = Header(default=None), db: Session = Depends(get_db), file_id: int = None):
    user = get_current_user(db, authorization[7:])
    file = db.query(File_Model).filter_by(id=file_id).first()

    if file.owner_id != user["user_id"]:
        raise credential_exception

    db.delete(file)
    db.commit()
    return {"status": "deleted successfully"}

@app.get("/download_file/{file_id}")
def download_file(authorization: str = Header(default=None), file_id: int = None, db: Session = Depends(get_db)):
    token = authorization[7:]
    user = get_current_user(db, token)
    file = db.query(File_Model).filter_by(id=file_id).first()
    if file.owner_id != user["user_id"]:
        raise credential_exception

    file_data_io = BytesIO(file.binary_data)

    return StreamingResponse(file_data_io, media_type='application/octet-stream', headers={'Content-Disposition': f'attachment; filename={file_id}'})