import json
import os
from werkzeug.security import generate_password_hash

from app.models import db, User


S3_BUCKET = os.environ.get('S3_BUCKET') # get env secret info
s3_banner = f's3://{S3_BUCKET}/banner-images/' # default aws url for banner images
s3_profile = f's3://{S3_BUCKET}/profile-images/' # default aws url for profile images
artist_data = 'app/seeds/data/artists_data.json' # seed data file location

# converting hyphens and spaces to underscores
def convert(x):
    return x.replace(' - ', '_').replace(' ', '_')


def seed_artists():
    with open(f'{artist_data}', 'r') as f:
        artists_list = json.loads(f.read())

        for artist in artists_list:
            user = convert(artist)

            seed = User(
                display_name=f'{artist}',
                email=f'{user}@sonicfog.com',
                hashed_password=generate_password_hash(f'{user}'),
                profile_url=f'{s3_profile}{user}_profile_500x500.jpg',
                banner_url=f'{s3_banner}{user}_banner_1240x260.jpg'
            )
            db.session.add(seed)

    db.session.commit()
