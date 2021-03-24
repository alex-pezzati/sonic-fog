from flask import Blueprint, request
from app.models import db, Song
from flask_login import current_user, login_required
from app.s3_songs import (
    upload_file_to_s3, allowed_file, get_unique_filename)
from app.api.waveform_routes import generate_waveform_and_duration

song_routes = Blueprint("song", __name__)


# Need to add: Validations and parsing/storing of other form fields (artist, album, etc)
@song_routes.route("", methods=["POST"])  # technically also updates
@login_required
def upload_song():
    if "song" not in request.files:
        return {"errors": "song required"}, 400

    name = request.form['name']
    song = request.files["song"]
    if not allowed_file(song.filename):
        return {"errors": "file type not permitted"}, 400

    aws_unique_name = get_unique_filename(song.filename)
    song.filename = aws_unique_name

    upload = upload_file_to_s3(song)

    # print("entered3")
    if "url" not in upload:
        # if the dictionary doesn't have a url key
        # it means that there was an error when we tried to upload
        # so we send back that error message
        return upload, 400

    song_url = upload["url"]

    data = generate_waveform_and_duration(aws_unique_name)
    waveform_data = data['waveform_data']
    duration = data['duration']
    duration = float(duration)

    new_song = Song(name=name, user_id=current_user.id,
                    url=song_url, aws_unique_name=aws_unique_name, normalized_data=waveform_data, duration=duration)
    db.session.add(new_song)
    db.session.commit()
    return {"url": song_url}
