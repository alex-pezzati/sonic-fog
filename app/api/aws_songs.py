from flask import Blueprint, request
from app.models import db, Song
from flask_login import current_user, login_required
from app.s3_songs import (
    upload_file_to_s3, allowed_file, get_unique_filename)

song_routes = Blueprint("song", __name__)


@song_routes.route("", methods=["POST"])  #technically also updates
@login_required
def upload_song():
    if "song" not in request.files:
        return {"errors": "song required"}, 400

    song = request.files["song"]
    if not allowed_file(song.filename):
        return {"errors": "file type not permitted"}, 400

    song.filename = get_unique_filename(song.filename)

    upload = upload_file_to_s3(song)

    # print("entered3")
    if "url" not in upload:
        # if the dictionary doesn't have a url key
        # it means that there was an error when we tried to upload
        # so we send back that error message
        return upload, 400

    song_url = upload["url"]

    new_song = Song(name="holder", user_id=current_user.id, url=song_url)
    db.session.add(new_song)
    db.session.commit()
    return {"url": song_url}
