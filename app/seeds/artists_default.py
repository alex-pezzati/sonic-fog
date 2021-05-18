import json
import os
from werkzeug.security import generate_password_hash

from app.models import db, User

S3_BUCKET = os.environ.get('S3_BUCKET')  # get env secret info
# default aws url for banner images
S3_BANNER_IMAGE_URL = f'https://{S3_BUCKET}.s3.amazonaws.com/seed/banner-images/'
# default aws url for profile images
S3_PROFILE_IMAGE_URL = f'https://{S3_BUCKET}.s3.amazonaws.com/seed/profile-images/'
# seed data file location
ARTIST_DATA_EXPORT = 'app/seeds/seed_data/seed_artists_data.json'
# EXAMPLE COMPLETE URL = https://{S3_BUCKET}.s3.amazonaws.com/seed/banner-images/Childish+Gambino+banner1240x260.jpg


def convert_to_snake_case(artist_entry):
    return artist_entry.replace(' - ', '_').replace(' ', '_')


# converting string to url format
def convert_to_url(artist_entry):
    return artist_entry.replace(' ', '+')


def seed_artists():
    with open(f'{ARTIST_DATA_EXPORT}', 'r') as f:
        artists_list = json.loads(f.read())

        for artist in artists_list:
            user = convert_to_snake_case(artist)
            url = convert_to_url(artist)

            seed = User(
                display_name=f'{artist}',
                email=f'{user}@sonicfog.com',
                hashed_password=generate_password_hash(f'{user}'),
                profile_url=f'{S3_PROFILE_IMAGE_URL}{url}+profile200x200.jpg',
                banner_url=f'{S3_BANNER_IMAGE_URL}{url}+banner1240x260.jpg')
            db.session.add(seed)

    db.session.commit()
