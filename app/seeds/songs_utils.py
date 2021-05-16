from scipy.io import wavfile as wav
from pydub import AudioSegment
from os.path import dirname, join as pjoin
import numpy as np
import json
import os
import sys

origin = r'/home/kumo/appaca/sound_cloud/app'  # of app
SEED_DATA_FOLDER = r'seeds/seed_data/music'  # seed data folder


# searchs 'seed' folder for songs
def search_songs(directory):
    song_list = []
    for entry in os.scandir(directory):
        if (entry.path.endswith(".mp3")) and entry.is_file():
            song_list.append(entry.path)

    return song_list


# remove path and extension from file name
def trim(song):
    _, tail = os.path.split(song)
    name, _ = tail.split('.mp3')
    return name


# generates duration and normalized wave data for each song
def generate_songs_and_artists_data():
    songs_data = []  # ds holding outputs before printing

    origin_data_dir = pjoin(f'{origin}',
                            f'{SEED_DATA_FOLDER}')  # path of folder for origin
    target_data_dir = pjoin(f'{origin}', 'static')  # path of folder for target
    destination_path = pjoin(
        target_data_dir,
        'target.wav')  # points to temp .wav that will be overwritten

    songs = search_songs(
        origin_data_dir)  # populate iterable of songs via helper fn
    for song in songs:
        try:
            origin_path = pjoin(
                origin_data_dir,
                f'{song}')  # need to change this to song_list entry.mp3
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
        ids = np.arange(len(rounded)) // chunk_size
        chunk_values = np.bincount(ids, rounded) / np.bincount(ids)

        # Normalize the data so that the loudest value is 100 and everything else is an integer relative to that
        # it's alot easier to think about and deal with values in the range 0-100 as opposed to 0-32000
        ratio = np.amax(chunk_values) / 100
        normalized = chunk_values / ratio
        normalized = np.rint(normalized)

        intArr = [int(val) for val in normalized]

        songs_data.append({
            'title': trim(song),  # removes extra characters via helper fn
            'waveform_data': intArr,
            'duration': data.shape[0] / rate
        })

    # writes data to external file
    with open('data/songs_data.json', 'w') as temp:
        json.dump(songs_data, temp, indent=2)


# driver
generate_songs_and_artists_data()
