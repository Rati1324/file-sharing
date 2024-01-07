from jose import jwt
import os, json, re
from datetime import timedelta, datetime
import time

SECRET_KEY="Iar5NaUHu_YeyR9eRrJG9g"
SECRET_KEY2="iar5NaUHu_YeyR9eRrJG9g"
ALGORITHM="HS256"

def create_token():
    expire_delta = timedelta(minutes=0.1)
    expire = datetime.utcnow() + expire_delta
    data = {"email": "email1", "exp": expire}
    jwt_token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return jwt_token

def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.JWTError:
        # raise Exception("Invalid token")
        print("Invalid token")
    # return payload

token = create_token()
print(verify_token(token))

time.sleep(12)
print(verify_token(token))
