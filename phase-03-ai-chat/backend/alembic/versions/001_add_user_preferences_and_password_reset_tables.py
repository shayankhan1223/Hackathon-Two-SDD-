"""Add user preferences and password reset tables

Revision ID: 001
Revises:
Create Date: 2026-02-16 06:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel
from datetime import datetime

# revision identifiers
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create user_preferences table
    op.create_table('user_preferences',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sqlmodel.sql.sqltypes.GUID(), nullable=False),
        sa.Column('display_name', sa.String(), nullable=True),
        sa.Column('timezone', sa.String(), server_default='UTC', nullable=False),
        sa.Column('theme', sa.String(), server_default='system', nullable=False),
        sa.Column('email_notifications', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('push_notifications', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id')
    )

    # Create password_reset_tokens table
    op.create_table('password_reset_tokens',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sqlmodel.sql.sqltypes.GUID(), nullable=False),
        sa.Column('token_hash', sa.String(length=64), nullable=False),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.Column('used', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.Index('ix_password_reset_tokens_token_hash', 'token_hash'),
        sa.Index('ix_password_reset_tokens_expires_at', 'expires_at'),
    )


def downgrade() -> None:
    # Drop password_reset_tokens table
    op.drop_table('password_reset_tokens')

    # Drop user_preferences table
    op.drop_table('user_preferences')