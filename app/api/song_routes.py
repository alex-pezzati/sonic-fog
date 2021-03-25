from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required

from scipy.io import wavfile as wav
import scipy
import numpy as np
from pydub import AudioSegment
import sys
from os.path import dirname, join as pjoin

from app.models import Song, db, User
from app.utils.s3_songs import (
    upload_file_to_s3, allowed_file, get_unique_filename, download_song_from_s3)

song_routes = Blueprint('song', __name__)


def generate_waveform_and_duration(aws_unique_name):
    download_song_from_s3(aws_unique_name)

    data_dir = pjoin('app', 'static')
    destination_path = pjoin(data_dir, 'target.wav')
    try:
        origin_path = pjoin(data_dir, 'target.mp3')
        sound = AudioSegment.from_mp3(origin_path)
        sound.export(destination_path, format="wav")
        wav_fname = pjoin(destination_path)
    except:
        e = sys.exc_info()[0]
        print(e)
        wav_fname = pjoin(origin_path)

    rate, data = wav.read(wav_fname)

    # Convert the data to mono if it is not already mono (makes future calculations easier)
    if (isinstance(data[0], np.ndarray)):
        mono_data = np.mean(data, 1)
    else:
        mono_data = data

    # WAV forms are almost symetrical, so we don't care about the negative values. Cuts the data in half. Yay!
    peaks = np.array(mono_data)
    peaks = peaks[peaks > 0.]

    # Round the data (the chunk value calculation needs the data to be rounded)
    rounded = np.rint(peaks)

    # This is approximately the number of bars that you will display
    number_of_chunks = 200

    # We don't need all this data. We only need number_of_chunks amount of data.
    # So group the data in chunk_size groups and create an array of the average of those chunks
    chunk_size = len(rounded) // number_of_chunks
    ids = np.arange(len(rounded))//chunk_size
    chunk_values = np.bincount(ids, rounded)/np.bincount(ids)

    # Normalize the data so that the loudest value is 100 and everything else is an integer relative to that
    # it's alot easier to think about and deal with values in the range 0-100 as opposed to 0-32000
    ratio = np.amax(chunk_values) / 100
    normalized = chunk_values / ratio
    normalized = np.rint(normalized)

    intArr = [int(val) for val in normalized]
    return {
        'waveform_data': intArr,
        'duration': data.shape[0] / rate
    }


@song_routes.route('/<int:song_id>')
def get_song_data(song_id):
    song = Song.query.get(song_id)
    uploader = User.query.get(song.user_id)
    return jsonify({
        'waveform_data': song.normalized_data,
        'duration': str(song.duration),
        'songURL': song.url,
        'songName': str(song.name),
        'uploaderName': str(uploader.display_name),
        'releaseDate': str(song.release_date),
        'id': song.id,
        'albumPhoto': str(song.cover_image),
    })


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


# @song_routes.route('/<int:song_id>')
# def get_waveform(song_id):
#     song = Song.query.filter(Song.id == 1).first()
#     aws_unique_name = song.aws_unique_name
#     download_song_from_s3(aws_unique_name)

#     data_dir = pjoin('app', 'static')
#     destination_path = pjoin(data_dir, 'target.wav')

#   # You gotta refacter this bro. This is hacky af.
#   # Ideally, you should check the type of file. If it's mp3 do one thing, if it's wav do another
#     try:
#         origin_path = pjoin(data_dir, 'target.mp3')
#         sound = AudioSegment.from_mp3(origin_path)
#         sound.export(destination_path, format="wav")
#         wav_fname = pjoin(destination_path)
#     except:
#         e = sys.exc_info()[0]
#         print(e)
#         wav_fname = pjoin(origin_path)

#     rate, data = wav.read(wav_fname)

#     # Convert the data to mono if it is not already mono (makes future calculations easier)
#     if (isinstance(data[0], np.ndarray)):
#         mono_data = np.mean(data, 1)
#     else:
#         mono_data = data

#     # WAV forms are almost symetrical, so we don't care about the negative values. Cuts the data in half. Yay!
#     peaks = np.array(mono_data)
#     peaks = peaks[peaks > 0.]

#     # Round the data (the chunk value calculation needs the data to be rounded)
#     rounded = np.rint(peaks)

#     # This is approximately the number of bars that you will display
#     number_of_chunks = 200

#     # We don't need all this data. We only need number_of_chunks amount of data.
#     # So group the data in chunk_size groups and create an array of the average of those chunks
#     chunk_size = len(rounded) // number_of_chunks
#     ids = np.arange(len(rounded))//chunk_size
#     chunk_values = np.bincount(ids, rounded)/np.bincount(ids)

#     # Normalize the data so that the loudest value is 100 and everything else is an integer relative to that
#     # it's alot easier to think about and deal with values in the range 0-100 as opposed to 0-32000
#     ratio = np.amax(chunk_values) / 100
#     normalized = chunk_values / ratio
#     normalized = np.rint(normalized)

#     return jsonify({
#         'data': normalized.tolist(),
#         'duration': data.shape[0] / rate
#     })
