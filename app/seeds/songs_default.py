import json
import os

from app.models import db, Song, User
# https://sonicfog.s3.amazonaws.com/seed/songs/album+art/Barretso+-+Celeste+album500x500.jpg
# https://sonicfog.s3.amazonaws.com/seed/songs/Barretso+-+Celeste.mp3
S3_BUCKET = os.environ.get('S3_BUCKET') # get env secret info
s3_songs = f'https://{S3_BUCKET}.s3.amazonaws.com/seed/songs/' # default aws url for songs
s3_art = f'https://{S3_BUCKET}.s3.amazonaws.com/seed/songs/album+art/' # default aws url for songs
songs_data = 'app/seeds/data/songs_data.json' # seed data file location

# trimming song name from file to get artist name
def artist(x):
    artist, _ = x.split(' -')
    return artist


def convert_snake(x):
    return x.replace(' - ', '_').replace(' ', '_')


def convert_url(x):
    return x.replace(' ', '+')
# https://sonicfog.s3.amazonaws.com/seed/songs/Barretso+-+Celeste.mp3
# https://sonicfog.s3.amazonaws.com/seed/songs/album+art/Barretso+-+Celeste+album500x500.jpg
def seed_songs():
    with open(f'{songs_data}', 'r') as f:
        song_list = json.loads(f.read())

        for song in song_list:
            user = artist(song['title'])
            url = convert_url(song['title'])
            title = song['title']

            seed = Song(
                user_id = db.session.query(User.id).filter(User.display_name == user).first(),
                artist = user,
                name = title,
                url = f'{s3_songs}{url}.mp3',
                cover_image = f'{s3_art}{url}+album500x500.jpg',
                duration = song['duration'],
                normalized_data = song['waveform_data'],
            )
            db.session.add(seed)

    db.session.commit()


def undo_songs():
    db.session.execute('TRUNCATE songs CASCADE;')
    db.session.commit()
