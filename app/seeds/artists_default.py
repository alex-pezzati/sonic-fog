import json
import os
from werkzeug.security import generate_password_hash

from app.models import db, User


# https://sonicfog.s3.amazonaws.com/seed/banner-images/Childish+Gambino+banner1240x260.jpg

S3_BUCKET = os.environ.get('S3_BUCKET') # get env secret info
s3_banner = f'https://{S3_BUCKET}.s3.amazonaws.com/seed/banner-images/' # default aws url for banner images
s3_profile = f'https://{S3_BUCKET}s3.amazonaws.com/seed/profile-images/' # default aws url for profile images
artist_data = 'app/seeds/data/artists_data.json' # seed data file location


def convert_snake(x):
    return x.replace(' - ', '_').replace(' ', '_')


def convert_url(x):
    return x.replace(' ', '+')


def seed_artists():
    with open(f'{artist_data}', 'r') as f:
        artists_list = json.loads(f.read())

        for artist in artists_list:
            user = convert_snake(artist)
            url = convert_url(artist)

            seed = User(
                display_name=f'{artist}',
                email=f'{user}@sonicfog.com',
                hashed_password=generate_password_hash(f'{user}'),
                profile_url=f'{s3_profile}{url}+profile200x200.jpg',
                banner_url=f'{s3_banner}{url}+banner1240x260.jpg'
            )
            db.session.add(seed)

    db.session.commit()
