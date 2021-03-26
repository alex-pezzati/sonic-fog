from flask.cli import AppGroup

from .artists_default import seed_artists
from .songs_default import seed_songs, undo_songs
from .users import seed_users, undo_users

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')

# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    seed_users()
    seed_artists()
    seed_songs()
    # Add other seed functions here

# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_songs()
    undo_users()
    # Add other undo functions here
