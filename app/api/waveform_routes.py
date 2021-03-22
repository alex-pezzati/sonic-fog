from flask import Blueprint, jsonify
from scipy.io import wavfile as wav
import scipy
import numpy as np
from os.path import dirname, join as pjoin
from app.models import User, db

waveform_routes = Blueprint('waveform', __name__)


@waveform_routes.route('/')
def get_waveform():
    data_dir = pjoin('app', 'static')
    wav_fname = pjoin(data_dir, 'Buttercup.wav')

    rate, data = wav.read(wav_fname)
    data = np.array(data)

    mono_data = np.mean(data, 1)

    # WAV forms are almost symetrical, so we don't care about the negative values. Cuts the data in half. Yay!
    peaks = np.array(mono_data)
    peaks = peaks[peaks > 0.]

    # Make the all the points integers relative to 10000 (why 10000? Cuz the max is like, 110000 something or other)
    rounded = np.rint(peaks)

    number_of_chunks = 200
    chunk_size = len(rounded) // number_of_chunks

    ids = np.arange(len(rounded))//chunk_size
    chunk_values = np.bincount(ids, rounded)/np.bincount(ids)

    ratio = np.amax(chunk_values) / 100
    normalized = chunk_values / ratio
    normalized = np.rint(normalized)

    return jsonify({
        'data': normalized.tolist(),
        'duration': data.shape[0] / rate
    })
