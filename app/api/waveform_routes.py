from flask import Blueprint, jsonify
from scipy.io import wavfile as wav
import scipy
import numpy as np
from pydub import AudioSegment
import sys

from os.path import dirname, join as pjoin
from app.models import Song, db
from app.s3_songs import download_song_from_s3

waveform_routes = Blueprint('waveform', __name__)


@waveform_routes.route('/waveform/<int:song_id>')
def get_waveform(song_id):
    song = Song.query.filter(Song.id == song_id).first()

    return jsonify({
        'waveform_data': song.normalized_data
    })


@waveform_routes.route('/duration/<int:song_id>')
def get_duration(song_id):
    song = Song.query.filter(Song.id == song_id).first()
    return str(song.duration)


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


# @waveform_routes.route('/<int:song_id>')
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
