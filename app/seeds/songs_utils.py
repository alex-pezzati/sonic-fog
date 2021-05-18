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

    return song_list


# trimming song name from file to get artist name
def artist_from_filename(song_entry):
    artist, track = song_entry.split(' - ')
    return artist, track


# remove path and extension from file name
def get_song_filename(song_file_name):
    _, tail = os.path.split(song_file_name)
    name, _ = tail.split('.mp3')
    return name


# generates duration and normalized wave data for each song
def generate_songs_and_artists_seed_data():
    songs_data = []  # ds holding outputs before printing
    artists_data = set()

    # path of folder for origin
    origin_data_dir = pjoin(APP_LOCAL_ORIGIN, SEED_MUSIC_FOLDER)

    songs = search_songs(origin_data_dir)
    # populate iterable of songs via helper fn

    for song in songs:

        song_origin = pjoin(
            origin_data_dir,
            f'{song}')  # need to change this to song_list entry.mp3

        data = generate_waveform_and_duration_data(song_origin)

        title = get_song_filename(song)

        songs_data.append({
            # removes extra characters via helper fn
            'title': title,
            'waveform_data': data['waveform_data'],
            'duration': data['duration']
        })

        artist, _track = artist_from_filename(title)

        artists_data.add(artist)

    # writes data to external file
    with open(SONGS_DATA_OUTPUT_LOCATION, 'w') as songs_temp:
        json.dump(songs_data, songs_temp, indent=2)

    with open(ARTISTS_DATA_OUTPUT_LOCATION, 'w') as artists_temp:
        json.dump(list(artists_data), artists_temp, indent=2)


# driver
generate_songs_and_artists_seed_data()
