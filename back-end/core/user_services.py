import os, re
from fastapi import Depends, Header
from sqlalchemy.orm import Session
from fastapi import APIRouter, HTTPException
from .utils import get_db
from .schemas import UserSchema, UserLoginSchema, TokenSchema, TokenDataSchema
from .models import User, File as File_Model
from datetime import timedelta
from typing import Optional
from .utils import (
    create_jwt_token, get_hashed_password, 
    verify_password, get_current_user, user_exists,
    credential_exception, get_db
)
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter()

@router.post("/verify_token")
async def verify_token(db: Session = Depends(get_db), authorization: str = Header(default=None)):
    return get_current_user(db, authorization[7:])
    
@router.post("/signup")
async def signup(db: Session = Depends(get_db), user_data: UserSchema = None):
    password_regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
    email_regex = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"
    username_regex = r"^(?=.*[a-zA-Z])(?=.*[\d\W]).{6,}$"

    if not re.match(password_regex, user_data.password):
        raise HTTPException(status_code=400, detail="Password is not secure")

    if not re.match(email_regex, user_data.email):
        raise HTTPException(status_code=400, detail="Invalid email")

    # wtf is this regex
    if not re.match(username_regex, user_data.username):
        raise HTTPException(status_code=400, detail="Your username must contain at least one letter, one number or special character, and be at least 6 characters long")

    check_user_exists = user_exists(db, user_data.email)
    if check_user_exists:
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

@router.post('/signin', response_model=TokenSchema)
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

# write an endpoint for finding users based on email
@router.get("/get_users")
async def signin(authorization: str = Header(default=None), db: Session = Depends(get_db), search: Optional[str] = None):
    token = authorization[7:]
    current_user = get_current_user(db, token)
    user = db.query(User).filter(User.email.like(f"%{search}%")).all()
    user = [i for i in user if i.email != current_user["email"]]
    return user