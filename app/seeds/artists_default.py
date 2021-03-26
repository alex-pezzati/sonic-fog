import json
import os
from werkzeug.security import generate_password_hash

from app.models import db, User


S3_BUCKET = os.environ.get('S3_BUCKET')
s3_banner = f's3://{S3_BUCKET}/banner-images/'
s3_profile = f's3://{S3_BUCKET}/profile-images/'
artist_data = 'app/seeds/data/artist_data.json'

# artist_list= [
#         "ODESZA",
#         "Swell",
#         "Tame Impala",
#     ]

# converting spaces to underscores
def convert(string):
    n = len(string)
    string = list(string)

    for i in range(n):
        if (string[i] == ' '):
            string[i] = '_'

    string = "".join(string)
    return string


def seed_artists():
    with open(f'{artist_data}', 'r') as f:
        artists_list = json.loads(f.read())

    for artist in artists_list:
        snakey = convert(artist)
        seed = User(
            display_name=f'{artist}',
            email=f'{snakey}@sonicfog.com',
            hashed_password=generate_password_hash(f'{snakey}'),
            profile_url=f'{s3_profile}{snakey}_profile_500x500.jpg',
            banner_url=f'{s3_banner}{snakey}_banner_1240x260.jpg'
        )
        db.session.add(seed)

    db.session.commit()
