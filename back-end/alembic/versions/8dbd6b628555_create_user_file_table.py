"""create user_file table

Revision ID: 8dbd6b628555
Revises: f67526e064fc
Create Date: 2024-02-17 11:12:46.517808

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8dbd6b628555'
down_revision: Union[str, None] = 'f67526e064fc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table(
        'user_file',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('file_id', sa.Integer(), nullable=False),
        sa.Column('share_date', sa.Date(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['user.id']),
        sa.ForeignKeyConstraint(['file_id'], ['file.id']),
    )


def downgrade() -> None:
    op.drop_table('user_file')
