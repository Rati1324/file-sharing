"""empty message

Revision ID: f67526e064fc
Revises: 19f5c8fb857b
Create Date: 2024-02-17 07:07:14.064057

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'f67526e064fc'
down_revision: Union[str, None] = '19f5c8fb857b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table('user',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('username', sa.VARCHAR(), autoincrement=False, nullable=True),
        sa.Column('email', sa.VARCHAR(), autoincrement=False, nullable=True),
        sa.Column('disabled', sa.BOOLEAN(), autoincrement=False, nullable=True),
        sa.Column('password', sa.VARCHAR(), autoincrement=False, nullable=True),
        sa.PrimaryKeyConstraint('id', name='user_pkey')
    )

    op.create_table('file',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=True),
        sa.Column('binary_data', postgresql.BYTEA(), autoincrement=False, nullable=True),
        sa.Column('owner_id', sa.INTEGER(), autoincrement=False, nullable=True),
        sa.ForeignKeyConstraint(['owner_id'], ['user.id'], name='file_owner_id_fkey'),
        sa.PrimaryKeyConstraint('id', name='file_pkey')
    )

    op.create_index('ix_file_id', 'file', ['id'], unique=False)
    op.create_index('ix_user_id', 'user', ['id'], unique=False)   


def downgrade() -> None:
    op.drop_index('ix_user_id', table_name='user')
    op.drop_table('user')
    op.drop_index('ix_file_id', table_name='file')
    op.drop_table('file')