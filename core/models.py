from sqlalchemy import Column, Integer, String, Boolean, LargeBinary
from sqlalchemy.orm import relationship
from core.config import Base

class User(Base):
    __tablename__ = "user"
    id: int = Column(Integer, primary_key=True, index=True)
    username: str = Column(String)
    email: str = Column(String)
    disabled: bool = Column(Boolean)
    password: str = Column(String)

class File(Base):
    __tablename__ = "file"
    id: int = Column(Integer, primary_key=True, index=True)
    name: str = Column(String)
    binary_data = Column(LargeBinary)