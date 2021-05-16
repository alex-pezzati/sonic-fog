import json
import os

from app.models import db, Song, User

S3_BUCKET = os.environ.get('S3_BUCKET')  # get env secret info
S3_SONGS_URL = f'https://{S3_BUCKET}.s3.amazonaws.com/seed/songs/'  # default aws url for songs
S3_ALBUM_ART_URL = f'https://{S3_BUCKET}.s3.amazonaws.com/seed/songs/album+art/'  # default aws url for songs
SONGS_DATA_EXPORT = 'app/seeds/data/songs_data.json'  # seed data file location


# trimming song name from file to get artist name
def artist_from_filename(song_entry):
    artist, track = song_entry.split(' - ')
    return artist, track


# converting string to url format
def convert_to_url(song_entry):
    return song_entry.replace(' ', '+')


def seed_songs():
    with open(f'{SONGS_DATA_EXPORT}', 'r') as f:
        song_list = json.loads(f.read())

        for song in song_list:
            artist, track = artist_from_filename(song['title'])
            url = convert_to_url(song['title'])

            seed = Song(
                user_id=db.session.query(
                    User.id).filter(User.display_name == artist).first(),
                artist=artist,
                name=track,
                url=f'{S3_SONGS_URL}{url}.mp3',
                cover_image=f'{S3_ALBUM_ART_URL}{url}+album500x500.jpg',
                duration=song['duration'],
                normalized_data=song['waveform_data'],
                aws_unique_name=f'{url}.mp3')
            db.session.add(seed)

    db.session.commit()


def undo_songs():
    db.session.execute('TRUNCATE songs CASCADE;')
    db.session.commit()
