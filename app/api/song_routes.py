from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.forms import SongSubmitForm

from app.models import Song, db, User

from app.api.auth_routes import validation_errors_to_error_messages

# this is the helper function used to generate data for waveform graphics
from app.utils.waveform_gen import generate_waveform_and_duration_data
# aws s3 helper functions
from app.utils.s3_songs import (upload_file_to_s3, allowed_file,
                                get_unique_filename, download_song_from_s3)
from app.utils.s3_helpers import (upload_file_to_s3 as upload_photo_to_s3,
                                  allowed_file as allowed_photo,
                                  get_unique_filename as
                                  get_unique_photo_filename)

song_routes = Blueprint('songs', __name__)


@song_routes.route("", methods=["POST"])  # technically also updates
@login_required
def upload_song():
    form = SongSubmitForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        song = request.files['song_file']
        image = request.files['album_cover']
        name = request.form['song_name']

        data = generate_waveform_and_duration_data(song)
        waveform_data = data['waveform_data']
        duration = data['duration']
        duration = float(duration)

        aws_unique_name = get_unique_filename(song.filename)
        song.filename = aws_unique_name

        upload = upload_file_to_s3(song)
        if 'url' not in upload:
            # if the dictionary doesn't have a url key
            # it means that there was an error when we tried to upload
            # so we send back that error message
            print('error', upload)
            return {'errors': ['song_file : cannot upload file']}
        song_url = upload["url"]

        image.filename = get_unique_photo_filename(image.filename)
        upload = upload_photo_to_s3(image)
        if 'url' not in upload:
            # if the dictionary doesn't have a url key
            # it means that there was an error when we tried to upload
            # so we send back that error message
            print('error', upload)
            return {'errors': ['album_cover : cannot upload file']}
        banner_url = upload['url']

        new_song = Song(name=name,
                        user_id=current_user.id,
                        url=song_url,
                        aws_unique_name=aws_unique_name,
                        normalized_data=waveform_data,
                        duration=duration,
                        cover_image=banner_url)

        db.session.add(new_song)
        db.session.commit()

        return {"id": new_song.id}
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400


@song_routes.route('/<int:song_id>')
def get_song_data(song_id):
    if not song_id:
        return
    song = Song.query.filter(Song.id == song_id).first()
    if not song:
        return
    uploader = User.query.get(song.user_id)
    return jsonify({
        'waveform_data': song.normalized_data,
        'duration': str(song.duration),
        'songURL': song.url,
        'songName': str(song.name),
        'uploaderName': str(uploader.display_name),
        'uploaderProfile': str(uploader.profile_url),
        'uploaderBanner': str(uploader.banner_url),
        'releaseDate': str(song.release_date),
        'id': song.id,
        'albumPhoto': str(song.cover_image),
    })


# get initial list of songs for landing page
@song_routes.route('/get')
def get_songs():
    songs = {
        "songs": [
            song.to_dict() for song in Song.query.order_by(
                Song.uploaded_date.desc()).limit(18).all()
        ]
    }
    if not songs:
        return

    return jsonify(songs)


# gets list of songs for dynamic search on landing page
@song_routes.route('/<keyword>')
def search_songs(keyword):
    songs = {
        "songs": [
            song.to_dict()
            for song in Song.query.filter(Song.name.ilike(f"%{keyword}%")).
            order_by(Song.uploaded_date.desc()).limit(18).all()
        ]
    }
    if not songs:
        return
    return jsonify(songs)
