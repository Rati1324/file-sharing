from pydantic import BaseModel, Field
from typing import List

class UserLoginSchema(BaseModel):
    email: str = Field(default=None)
    password: str = Field(default=None)

class UserSchema(BaseModel):
    username: str = Field(default=None)
    email: str = Field(default=None)
    password: str = Field(default=None)
    disabled: bool = Field(default=None)

class TokenSchema(BaseModel):
    access_token: str = Field(default=None)
    token_type: str = Field(default=None)

class TokenDataSchema(BaseModel):
    username: str = None

class ShareFileSchema(BaseModel):
    user_ids: List[int] = Field(default=None)
    file_ids: List[int] = Field(default=None)
 
class DownloadFilesSchema(BaseModel):
    file_ids: List[int] = Field(default=None)

class DeleteFilesSchema(BaseModel):
    file_ids: List[int] = Field(default=None)