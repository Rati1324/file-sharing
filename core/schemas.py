from pydantic import BaseModel, Field

class UserSchema(BaseModel):
    username: str = Field(default=None)
    password: str = Field(default=None)

class TokenSchema(BaseModel):
    access_token: str = Field(default=None)
    token_type: str = Field(default=None)
        
class TokenDataSchema(BaseModel):
    username: str or None = None