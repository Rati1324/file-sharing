from sqlalchemy import Column, Integer, String, Boolean, LargeBinary, ForeignKey
from sqlalchemy.orm import relationship, Date
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
    owner_id = Column(Integer, ForeignKey("user.id"))
    owner = relationship("User", backref="file", cascade="all, delete")


class UserFile(Base):
    __tablename__ = "user_file" 
    id: int = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    file_id = Column(Integer, ForeignKey("file.id"))
    share_date = Column(Date)
    user = relationship("User", backref="user_file", cascade="all, delete")
    file = relationship("File", backref="user_file", cascade="all, delete")