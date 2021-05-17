from scipy.io import wavfile as wav
from pydub import AudioSegment
import numpy as np
import tempfile
import os


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
    number_of_chunks = 300

    # We don't need all this data. We only need number_of_chunks amount of data.
    # So group the data in chunk_size sized groups and create an array of the average of those chunks
    chunk_size = len(rounded) // number_of_chunks
    ids = np.arange(len(rounded)) // chunk_size
    chunk_values = np.bincount(ids, rounded) / np.bincount(ids)

    # Normalize the data so that the loudest value is 100 and everything else is an integer relative to that
    # it's alot easier to think about and deal with values in the range 0-100 as opposed to 0-32000
    ratio = np.amax(chunk_values) / 100
    normalized = chunk_values / ratio
    normalized = np.rint(normalized)

    # Convert the data from a numpy array to an array of ints. Easier to deal with
    intArr = [int(val) for val in normalized]

    return {'waveform_data': intArr, 'duration': data.shape[0] / rate}
