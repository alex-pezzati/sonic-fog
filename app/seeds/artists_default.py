from werkzeug.security import generate_password_hash
from app.models import db, User
import os

s3_banner_path='s3://sonicfog/banner-images/'
s3_profile_path='s3://sonicfog/profile-images/'
# directory = r'C:/home/kumo/appaca/Sound_Cloud/app/static/seed_data'

"""
goal: populate users table with "artists"
    display_name = artist name
    email = random stuff
    password = random stuff
    profile_url = image url from aws
    banner_url = image url from aws


goal: populate songs table with "songs"
    user_id = linked to artist of song
    name = song name
    duration = ??? ask jamie
    cover_image = image url from aws?? or from metadata??
    genre = ??? stretch

    ***need to make sure songs table is nullable***



    should i just make a list of artists with names properly formatted?

"""


# def search_artists():
#     artist_list = []
#     for entry in os.scandir(directory):
#         if (entry.path.endswith(".mp3")) and entry.is_file():
#             artist_list.append(entry.path)
#     return artist_list


def seed_artists():
    # artists = search_artists()

    artist = User(
        display_name='ODESZA',
        email='ODESZA@sonicfog.com',
        hashed_password=generate_password_hash('ODESZA'),
        profile_url=f'{s3_profile_path}ODESZA_profile_500x500.jpg',
        banner_url=f'{s3_banner_path}ODESZA_banner_1240x260.jpg'
    )

    db.session.add(artist)
    db.session.commit()


def undo_artists():
    db.session.execute('TRUNCATE users;')
    db.session.commit()
