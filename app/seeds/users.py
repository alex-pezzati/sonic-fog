from werkzeug.security import generate_password_hash
from app.models import db, User


# Adds a demo user for demo login
def seed_users():

    demo = User(display_name='Demo',
                email='demo@aa.io',
                hashed_password=generate_password_hash('password'))

    db.session.add(demo)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_users():
    db.session.execute('TRUNCATE users CASCADE;')
    db.session.commit()
