from werkzeug.security import generate_password_hash
from app.models import db, User
import os

s3_banner_path='s3://sonicfog/banner-images/'
s3_profile_path='s3://sonicfog/profile-images/'

artist_list= [
        "ODESZA",
        "Tame Impala",
        "Swell"
    ]

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


    read artist list
    create artist db entry

    read song list
    create song db entry

"""


# Converting space to underscore
def convert(string):
    n = len(string)
    string = list(string)

    for i in range(n):
        if (string[i] == ' '):
            string[i] = '_'

    string = "".join(string)
    return string


def seed_artists():

    for artist in artist_list:
        snakey= convert(artist)
        entry = User(
            display_name=f'{artist}',
            email=f'{snakey}@sonicfog.com',
            hashed_password=generate_password_hash(f'{snakey}'),
            profile_url=f'{s3_profile_path}{snakey}_profile_500x500.jpg',
            banner_url=f'{s3_banner_path}{snakey}_banner_1240x260.jpg'
        )
        db.session.add(entry)

    db.session.commit()


# def undo_artists():
#     db.session.execute('TRUNCATE users;')
#     db.session.commit()
