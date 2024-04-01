# ToDo
# 1) need to give unique id only once to the fileview array components so that it doesnt re-render unless its changed [x]
# 2) need to fix FileOperations props to delete file/files and download them [x]
# 3) fix mb/kb thing [x]
# 4) not redirecting when token is expired []

# main features:
# 1)delection [x]
# 2) download []
# 3) share []

import os, json, datetime, zipfile
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
from core.schemas import ShareFileSchema, DownloadFilesSchema, DeleteFilesSchema

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
        cur_user_id = db.query(User).filter_by(email=user["email"]).first().id

    if search is not None:
        files = db.query(File_Model).filter_by(owner_id=cur_user_id).filter(File_Model.name.ilike(f"%{search}%")).all()
    else:
        files = db.query(File_Model).filter_by(owner_id=cur_user_id).all()
        shared_files = db.query(File_Model).join(UserFile, File_Model.id == UserFile.file_id).filter(UserFile.user_id == cur_user_id).all()
        files += shared_files

    sizes = {"KB": 1000, "MB": 1000000, "GB": 1000000000}

    result = []
    for file in files:
        suffix = " KB"
        size = len(file.binary_data)
        if sizes["KB"] <= size < sizes["MB"]:
            size /= sizes["KB"]
            suffix = "KB"
        elif sizes["MB"] <= size < sizes["GB"]:
            size /= sizes["MB"]
            suffix = " MB"
        elif size >= sizes["GB"]:
            size /= sizes["GB"]
            suffix = " GB"
        size = str(round(size, 2)) + suffix

        owner = db.query(User).filter_by(id=file.owner_id).first()
        owner.email = owner.email if user["email"] != owner.email else "Me"

        result.append({
            "id": file.id,
            "name": file.name,
            "size": size,
            "owner": owner.email,
        })
    return result

@app.post("/share_files")
def share_file(authorization: str = Header(default=None), share_files_data: ShareFileSchema = None, db: Session = Depends(get_db)):
    token = authorization[7:]
    current_user = get_current_user(db, token)

    for file in share_files_data.file_ids:
        db_file = db.query(File_Model).filter_by(id=file).first()
        if db_file.owner_id != current_user["user_id"]:
            raise credential_exception

    # get current date
    date = datetime.datetime.now().date()

    share_file_models = []
    for u in share_files_data.user_ids:
        for f in share_files_data.file_ids:
            check_existing = db.query(UserFile).filter_by(user_id=u, file_id=f).first()
            if check_existing is None:
                share_file_models.append(UserFile(user_id=u, file_id=f, share_date=date))
    db.add_all(share_file_models)
    db.commit()
    return {"result": share_files_data}

@app.post("/download_file")
def download_file(authorization: str = Header(default=None), db: Session = Depends(get_db), file_ids: DownloadFilesSchema = None):
    token = authorization[7:]
    user = get_current_user(db, token)

    files = db.query(File_Model).filter(File_Model.id.in_(file_ids.file_ids)).all()
    invalid_owner = len([1 for file in files if file.owner_id != user["user_id"]])
    
    if invalid_owner:
        shared_files = db.query(UserFile).filter(UserFile.file_id.in_(file_ids.file_ids)).all()
        invalid_creds = len([1 for file in shared_files if file.user_id != user["user_id"]])

        if invalid_creds:
            raise credential_exception

    if len(files) == 1:
        file_data = BytesIO(files[0].binary_data)
        return StreamingResponse(file_data, media_type='application/octet-stream', headers={'Content-Disposition': f'attachment; filename={files[0].name}'})

    else:
        zipped_files = BytesIO()
        with zipfile.ZipFile(zipped_files, 'w') as zip_file:
            print(file_ids)
            for file_id in file_ids.file_ids:
                file = db.query(File_Model).filter_by(id=file_id).first()
                zip_file.writestr(file.name, file.binary_data)
        zipped_files.seek(0)
        return StreamingResponse(zipped_files, media_type='application/zip', headers={'Content-Disposition': 'attachment; filename=files.zip'})

@app.post("/delete_files")
async def delete_files(authorization: str = Header(default=None), request: Request = None, db: Session = Depends(get_db)):
    user = get_current_user(db, authorization[7:])
    file_ids = await request.json()

    files = db.query(File_Model).filter(File_Model.id.in_(file_ids)).all()
    shared_files = [row[0] for row in db.query(UserFile.file_id).filter(UserFile.file_id.in_(file_ids)).all()]

    for file in files:
        print(file.id, shared_files)
        if file.owner_id == user["user_id"]:
            db_user = db.query(User).filter_by(id=user["user_id"]).first()
            db_user.file.remove(file)
        elif file.id in shared_files:
            db.query(UserFile).filter(UserFile.file_id==file.id).delete()
        else:
            raise credential_exception
        
    db.commit()
    return {"status": "deleted successfully"}

@app.get("/download_file")
def download_file(authorization: str = Header(default=None), db: Session = Depends(get_db), file_ids: DownloadFilesSchema = None):
    token = authorization[7:]
    user = get_current_user(db, token)

    files = db.query(File_Model).filter(File_Model.id.in_(file_ids.file_ids)).all()
    invalid_owner = len([1 for file in files if file.owner_id != user["user_id"]])
    
    if invalid_owner:
        shared_files = db.query(UserFile).filter(UserFile.file_id.in_(file_ids.file_ids)).all()
        invalid_creds = len([1 for file in shared_files if file.user_id != user["user_id"]])

        if invalid_creds:
            raise credential_exception

    if len(files) == 1:
        file_data = BytesIO(files[0].binary_data)
        return StreamingResponse(file_data, media_type='application/octet-stream', headers={'Content-Disposition': f'attachment; filename={files[0].name}'})

    else:
        zipped_files = BytesIO()
        with zipfile.ZipFile(zipped_files, 'w') as zip_file:
            print(file_ids)
            for file_id in file_ids.file_ids:
                file = db.query(File_Model).filter_by(id=file_id).first()
                zip_file.writestr(file.name, file.binary_data)
        zipped_files.seek(0)
        return StreamingResponse(zipped_files, media_type='application/zip', headers={'Content-Disposition': 'attachment; filename=files.zip'})

@app.post("/share_files")
def share_file(authorization: str = Header(default=None), share_files_data: ShareFileSchema = None, db: Session = Depends(get_db)):
    token = authorization[7:]
    current_user = get_current_user(db, token)

    for file in share_files_data.files:
        db_file = db.query(File_Model).filter_by(id=file).first()
        if db_file.owner_id != current_user["user_id"]:
            raise credential_exception

    shareFile_models = []
    for u in share_files_data.user_ids:
        for f in share_files_data.files:
            shareFile_models.append(ShareFile(user_id=u, file_id=f))
    db.add_all(shareFile_models)
    db.commit()
    return {"result": share_files_data}