from flask_wtf import FlaskForm
from wtforms import StringField
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms.validators import DataRequired, ValidationError

from app.utils.s3_songs import (allowed_file as allowed_song)
from app.utils.s3_helpers import (allowed_file as allowed_photo)


def valid_song_type(form, field):
    print("Checking song type", field.data)
    song = field.data
    if not allowed_song(song.filename):
        raise ValidationError("the song type is not supported")

def valid_image_type(form, field):
    print("Checking album cover type", field.data)
    image = field.data
    if not allowed_photo(image.filename):
        raise ValidationError("the image type is not supported")

class SongSubmitForm(FlaskForm):
    song_file = FileField("Song File", validators=[FileRequired(), FileAllowed(['wav', 'mp3'], 'MP3 and Wav files only')])
    song_name = StringField("Song Name", validators=[DataRequired()])
    album_cover = FileField("Album Cover", validators=[FileRequired(), valid_image_type])
