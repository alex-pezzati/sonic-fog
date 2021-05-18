from scipy.io import wavfile as wav
from pydub import AudioSegment
from os.path import join as pjoin
import numpy as np
import json
import os
import sys

# helper function used to generate data for waveform graphics
from app.utils import generate_waveform_and_duration_data

# data origin paths
APP_LOCAL_ORIGIN = os.environ.get('APP_LOCAL_ORIGIN')  # of app
SEED_MUSIC_FOLDER = 'seeds/seed_data/music'  # seed data folder

# data output files
ARTISTS_DATA_OUTPUT_LOCATION = 'seed_data/seed_artists_data.json'
SONGS_DATA_OUTPUT_LOCATION = 'seed_data/seed_songs_data.json'


# searchs 'seed' folder for songs
def search_songs(directory):
    song_list = []
    for entry in os.scandir(directory):
        if (entry.path.endswith(".mp3")) and entry.is_file():
            song_list.append(entry.path)

    # print(song_list)
    return song_list


# remove path and extension from file name
def trim(song_file_name):
    _, tail = os.path.split(song_file_name)
    name, _ = tail.split('.mp3')
    return name


# generates duration and normalized wave data for each song
def generate_songs_and_artists_seed_data():
    songs_data = []  # ds holding outputs before printing
    print('hello')
    # print(APP_LOCAL_ORIGIN)
    # print(SEED_MUSIC_FOLDER)
    # print(ARTISTS_DATA_OUTPUT_LOCATION)
    # print(SONGS_DATA_OUTPUT_LOCATION)

    # path of folder for origin
    origin_data_dir = pjoin(APP_LOCAL_ORIGIN, SEED_MUSIC_FOLDER)
    # print(origin_data_dir)
    # print('what is this')

    songs = search_songs(origin_data_dir)
    # populate iterable of songs via helper fn

    for song in songs:
        print(song)

        song_origin = pjoin(
            origin_data_dir,
            f'{song}')  # need to change this to song_list entry.mp3

        data = generate_waveform_and_duration_data(song_origin)
        print(data)
        # artists_data

        songs_data.append({
            'title': trim(song),  # removes extra characters via helper fn
            'waveform_data': data['waveform_data'],
            'duration': data['duration']
        })

    # writes data to external file
    with open(SONGS_DATA_OUTPUT_LOCATION, 'w') as temp:
        json.dump(songs_data, temp, indent=2)


# driver
generate_songs_and_artists_seed_data()
