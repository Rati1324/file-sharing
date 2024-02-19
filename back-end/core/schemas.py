from pydantic import BaseModel, Field

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
    username: str or None = None

class ShareFileSchema(BaseModel):
    user_ids: list = Field(default=None)
    files: list = Field(default=None)
    