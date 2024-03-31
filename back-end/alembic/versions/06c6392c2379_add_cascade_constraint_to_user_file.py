"""add cascade constraint to user_file

Revision ID: 06c6392c2379
Revises: 8dbd6b628555
Create Date: 2024-03-31 15:41:45.160700

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '06c6392c2379'
down_revision: Union[str, None] = '8dbd6b628555'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint('user_file_user_id_fkey', 'user_file', type_='foreignkey')
    op.create_foreign_key(None, 'user_file', 'user', ['user_id'], ['id'], ondelete='CASCADE')
    op.drop_constraint('user_file_file_id_fkey', 'user_file', type_='foreignkey')
    op.create_foreign_key(None, 'user_file', 'file', ['file_id'], ['id'], ondelete='CASCADE')


def downgrade() -> None:
    pass
