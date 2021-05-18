import json
import os
from os.path import join as pjoin

# helper function used to generate data for waveform graphics
from app.utils import generate_waveform_and_duration_data

# data origin paths
# depending on your IDE these constants may not be necessary;
# they may be required to run this script in your terminal
APP_LOCAL_ORIGIN = os.environ.get('APP_LOCAL_ORIGIN')  # path of the app
SEED_MUSIC_FOLDER = 'seeds/seed_data/music'  # seed data folder

# data output files
ARTISTS_DATA_OUTPUT_LOCATION = '../seed_data/seed_artists_data.json'
SONGS_DATA_OUTPUT_LOCATION = '../seed_data/seed_songs_data.json'


# searchs 'seed music' folder for songs
def search_songs(directory):
    song_list = []
    for entry in os.scandir(directory):
        if (entry.path.endswith('.mp3')) and entry.is_file():
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


# generates duration and normalized wave data for each song for seeding
def generate_songs_and_artists_seed_data():
    '''
        This function and its helpers are designed to generate and aggregate
        data for seeding default data for "artists" and "songs" in SonicFog.
        AWS bandwidth has limits and these utilities offset some of that load
        by performing operations locally.
    '''
    songs_data = []  # ds holding outputs before printing
    artists_data = set()  # this is a set to prevent duplicate entries

    # path of folder for origin
    origin_data_dir = pjoin(APP_LOCAL_ORIGIN, SEED_MUSIC_FOLDER)

    # populate iterable of songs via helper fn
    songs = search_songs(origin_data_dir)

    for song in songs:
        # path for individual song file
        song_origin = pjoin(origin_data_dir, f'{song}')

        # this helper creates the date required to make the waveform graphic
        data = generate_waveform_and_duration_data(song_origin)

        # removes extra characters via helper fn
        title = get_song_filename(song)

        # grabs only artist name from leftover track title
        artist, _track = artist_from_filename(title)

        # aggregates artist names for exporting
        artists_data.add(artist)

        # aggregates song information for exporting
        songs_data.append({
            'title': title,
            'waveform_data': data['waveform_data'],
            'duration': data['duration']
        })

    # writes data to external files
    with open(ARTISTS_DATA_OUTPUT_LOCATION, 'w') as artists_temp:
        json.dump(list(artists_data), artists_temp, indent=2)

    with open(SONGS_DATA_OUTPUT_LOCATION, 'w') as songs_temp:
        json.dump(songs_data, songs_temp, indent=2)


# driver
generate_songs_and_artists_seed_data()
