import json
import os

from app.models import db, Song, User


S3_BUCKET = os.environ.get('S3_BUCKET') # get env secret info
s3_songs = f's3://{S3_BUCKET}/songs/' # default aws url for songs
songs_data = 'app/seeds/data/songs_data.json' # seed data file location

# trimming song name from file to get artist name
def artist(x):
    artist, _ = x.split(' -')
    return artist

# converting hyphens and spaces to underscores
def convert(x):
    return x.replace(' - ', '_').replace(' ', '_')


def seed_songs():
    with open(f'{songs_data}', 'r') as f:
        song_list = json.loads(f.read())

        for song in song_list:
            user = artist(song['title'])
            art = convert(song['title'])
            title = song['title']

            seed = Song(
                user_id = db.session.query(User.id).filter(User.display_name == user).first(),
                artist = user,
                name = title,
                url = f'{s3_songs}{title}',
                cover_image = f'{s3_songs}{title}{art}_500x500.jpg',
                duration = song['duration'],
                normalized_data = song['waveform_data'],
            )
            db.session.add(seed)

    db.session.commit()


def undo_songs():
    db.session.execute('TRUNCATE songs CASCADE;')
    db.session.commit()
