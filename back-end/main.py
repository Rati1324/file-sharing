import os, json
import datetime
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Header, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from fastapi.responses import StreamingResponse
from core.user_services import router as user_services
from typing import Optional

from core.utils import (
    get_current_user, 
    user_exists,
    credential_exception,
    get_db,
)

from core.config import Base, engine
from core.models import User, File as File_Model, UserFile
from core.schemas import ShareFileSchema

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


@app.post("/share_files")
def share_file(authorization: str = Header(default=None), share_files_data: ShareFileSchema = None, db: Session = Depends(get_db)):
    token = authorization[7:]
    # current_user = get_current_user(db, token)

    # for file in share_files_data.files:
    #     db_file = db.query(File_Model).filter_by(id=file).first()
    #     if db_file.owner_id != current_user["user_id"]:
    #         raise credential_exception

    # users_file = [ShareFile(file_id: i.file_id, user_id: i.user_id) for i in share_files_data]
    print(share_files_data)
    userFile_models = []
    now = datetime.datetime.now()
    for u in share_files_data.user_ids:
        for f in share_files_data.files:
            userFile_models.append(UserFile(user_id=u, file_id=f, share_date=now))
    db.add_all(userFile_models)
    db.commit()
    return {"result": share_files_data}