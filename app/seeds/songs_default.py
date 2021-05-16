import json
import os

from app.models import db, Song, User

S3_BUCKET = os.environ.get('S3_BUCKET')  # get env secret info
s3_songs = f'https://{S3_BUCKET}.s3.amazonaws.com/seed/songs/'  # default aws url for songs
s3_art = f'https://{S3_BUCKET}.s3.amazonaws.com/seed/songs/album+art/'  # default aws url for songs
songs_data = 'app/seeds/data/songs_data.json'  # seed data file location


# trimming song name from file to get artist name
def artist_track(x):
    artist, track = x.split(' - ')
    return artist, track


def convert_url(x):
    return x.replace(' ', '+')


def seed_songs():
    with open(f'{songs_data}', 'r') as f:
        song_list = json.loads(f.read())

        for song in song_list:
            artist, track = artist_track(song['title'])
            url = convert_url(song['title'])

            seed = Song(user_id=db.session.query(
                User.id).filter(User.display_name == artist).first(),
                        artist=artist,
                        name=track,
                        url=f'{s3_songs}{url}.mp3',
                        cover_image=f'{s3_art}{url}+album500x500.jpg',
                        duration=song['duration'],
                        normalized_data=song['waveform_data'],
                        aws_unique_name=f'{url}.mp3')
            db.session.add(seed)

    db.session.commit()


def undo_songs():
    db.session.execute('TRUNCATE songs CASCADE;')
    db.session.commit()
