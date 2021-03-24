"""added unique aws name column to users

Revision ID: 7add6d99f5a8
Revises: 59c81876311e
Create Date: 2021-03-23 22:50:59.269318

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7add6d99f5a8'
down_revision = '59c81876311e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('songs', sa.Column('aws_unique_name', sa.String(length=255), nullable=True))
    op.create_unique_constraint(op.f('uq_songs_aws_unique_name'), 'songs', ['aws_unique_name'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(op.f('uq_songs_aws_unique_name'), 'songs', type_='unique')
    op.drop_column('songs', 'aws_unique_name')
    # ### end Alembic commands ###