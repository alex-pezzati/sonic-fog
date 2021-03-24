from .db import db
from .user import join_playlist


class Playlist(db.Model):
   __tablename__ = "playlists"
   id = db.Column(db.INTEGER, primary_key=True)
   song_id = db.Column(db.INTEGER, db.ForeignKey("songs.id"))
   name = db.Column(db.String(50), nullable=False)

   song = db.relationship("Song")
   user = db.relationship(
      "User",
      secondary=join_playlist,
      back_populates="playlist"
   )
