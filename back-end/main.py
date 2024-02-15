import os, json, re, base64
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, Header, Request
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
from core.user_services import router as user_services
from typing import Optional

from core.utils import (
    create_jwt_token, get_hashed_password, 
    verify_password, get_current_user, user_exists,
    credential_exception, get_db
)

from core.config import Base, engine, SessionLocal
from core.models import User, File as File_Model

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="signin")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI()
app.include_router(user_services)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all HTTP headers
)

Base.metadata.create_all(bind=engine)

@app.get("/test")
async def test():
    return {"status": "ok"}

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
async def get_files(authorization: str = Header(default=None), search: Optional[str] = None, db: Session = Depends(get_db)):
    token = authorization[7:]
    user = get_current_user(db, token)
    if user is not None:
        user_id = db.query(User).filter_by(email=user["email"]).first().id

    if search is not None:
        files = db.query(File_Model).filter_by(owner_id=user_id).filter(File_Model.name.ilike(f"%{search}%")).all()
    else:
        files = db.query(File_Model).filter_by(owner_id=user_id).all()

    sizes = {"KB": 1024, "MB": 1048576, "GB": 1073741824}

    result = []
    for file in files:
        suffix = " KB"
        size = (round(len(file.binary_data)/1024, 2))
        if sizes["MB"] < size < sizes["GB"]:
            suffix = " MB"
        elif size > sizes["GB"]:
            suffix = " GB"
        size = str(size) + suffix

        result.append({
            "id": file.id,
            "name": file.name,
            "size": size
        })
    return {"result": result}

@app.delete("/delete_files")
async def delete_files(authorization: str = Header(default=None), db: Session = Depends(get_db), res: Request = None):
    user = get_current_user(db, authorization[7:])
    file_ids = json.loads(await res.body())

    files = db.query(File_Model).filter(File_Model.id.in_(file_ids)).all()
    for file in files:
        if file.owner_id != user["user_id"]:
            raise credential_exception

    for file in files:
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

    return StreamingResponse(file_data_io, media_type='application/octet-stream', headers={'Content-Disposition': f'attachment; filename={file.name}'})