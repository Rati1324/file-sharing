"""add file table

Revision ID: 35b6d84e4f8b
Revises: eff6b676ad63
Create Date: 2023-11-20 20:44:16.499222

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '35b6d84e4f8b'
down_revision: Union[str, None] = 'eff6b676ad63'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table('file',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=True),
        sa.Column('binary_data', postgresql.BYTEA(), autoincrement=False, nullable=True),
        sa.PrimaryKeyConstraint('id', name='file_pkey')
    )

def downgrade() -> None:
    op.drop_table('file')