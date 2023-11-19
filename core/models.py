from sqlalchemy import Column, Integer, String, Boolean 
from sqlalchemy.orm import relationship
from core.config import Base

class User(Base):
    __tablename__ = "user"
    id: int = Column(Integer, primary_key=True, index=True)
    username: str = Column(String)
    email: str = Column(String)
    disabled: bool = Column(Boolean)
    password: str = Column(String)