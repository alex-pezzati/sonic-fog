from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.forms import SongSubmitForm

# For waveform generation
from scipy.io import wavfile as wav
import numpy as np
from pydub import AudioSegment
import tempfile
import os

from app.api.auth_routes import validation_errors_to_error_messages

from app.models import Song, db, User
from app.utils.s3_songs import (
    upload_file_to_s3, allowed_file, get_unique_filename, download_song_from_s3)
from app.utils.s3_helpers import (
    upload_file_to_s3 as upload_photo_to_s3,
    allowed_file as allowed_photo,
    get_unique_filename as get_unique_photo_filename)

song_routes = Blueprint('songs', __name__)


def generate_waveform_and_duration(song):
    extension = song.filename.rsplit(".", 1)[1].lower()

    if extension == 'mp3':

      # Turn the song into an AudioSegment object, which will be used to convert the song type
      mp3 = AudioSegment.from_mp3(song)

      # The above funtion reads the song file. When that file is read, the pointer moves to the end of the file.
      # song.seek(0) resets the pointer to the beginning of the file so that it can be read again by other functions below
      song.seek(0)

      # Make a tempory file to store the wav file we are about to create
      _, path = tempfile.mkstemp(suffix='.wav')

      # Convert the song to wav and store it in the temporary file
      mp3.export(path, format="wav")

      # Read the amplitude data from the temporary file
      rate, data = wav.read(path)

      # Delete the temporary file
      os.remove(path)

    elif extension == 'wav':
      rate, data = wav.read(song)

    # Convert the data to mono if it is not already mono (makes future calculations easier)
    if (isinstance(data[0], np.ndarray)):
        mono_data = np.mean(data, 1)
    else:
        mono_data = data

    # WAV forms are almost symetrical, so we don't care about the negative values. Cuts the data in half. Yay!
    # peaks = np.array(mono_data)
    # peaks = peaks[peaks > 0.]
    peaks = mono_data[mono_data > 0]

    # Round the data (the chunk value calculation needs the data to be rounded)
    rounded = np.rint(peaks)

    # This is approximately the number of bars that you will display
    number_of_chunks = 200

    # We don't need all this data. We only need number_of_chunks amount of data.
    # So group the data in chunk_size sized groups and create an array of the average of those chunks
    chunk_size = len(rounded) // number_of_chunks
    ids = np.arange(len(rounded))//chunk_size
    chunk_values = np.bincount(ids, rounded)/np.bincount(ids)

    # Normalize the data so that the loudest value is 100 and everything else is an integer relative to that
    # it's alot easier to think about and deal with values in the range 0-100 as opposed to 0-32000
    ratio = np.amax(chunk_values) / 100
    normalized = chunk_values / ratio
    normalized = np.rint(normalized)

    # Convert the data from a numpy array to an array of ints. Easier to deal with
    intArr = [int(val) for val in normalized]

    return {
        'waveform_data': intArr,
        'duration': data.shape[0] / rate
    }

# Need to add: Validations and parsing/storing of other form fields (artist, album, etc)
@song_routes.route("", methods=["POST"])  # technically also updates
@login_required
def upload_song():
    form = SongSubmitForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
      song = request.files["song_file"]
      image = request.files['album_cover']
      name = request.form['song_name']

      data = generate_waveform_and_duration(song)
      waveform_data = data['waveform_data']
      duration = data['duration']
      duration = float(duration)

      aws_unique_name = get_unique_filename(song.filename)
      song.filename = aws_unique_name

      upload = upload_file_to_s3(song)
      if "url" not in upload:
          # if the dictionary doesn't have a url key
          # it means that there was an error when we tried to upload
          # so we send back that error message
          return upload, 400
      song_url = upload["url"]


      image.filename = get_unique_photo_filename(image.filename)
      upload = upload_photo_to_s3(image)
      if "url" not in upload:
          # if the dictionary doesn't have a url key
          # it means that there was an error when we tried to upload
          # so we send back that error message
          return {'errors': upload}
      banner_url = upload["url"]

      new_song = Song(name=name, user_id=current_user.id,
                      url=song_url, aws_unique_name=aws_unique_name,
                      normalized_data=waveform_data, duration=duration,
                      cover_image = banner_url)

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




# get list of songs; built for landing page
@song_routes.route('/get')
def get_songs():
    songs = { "songs": [song.to_dict() for song in Song.query.limit(16).all()] }
    if not songs:
        return

    return jsonify(songs)
