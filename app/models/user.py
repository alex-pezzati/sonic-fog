from .db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


# join_playlist = db.Table(
#   "join_playlist",
#   db.Column(
#       "user_id",
#       db.INTEGER,
#       db.ForeignKey("users.id"),
#       primary_key=True
#   ),
#   db.Column(
#       "playlist_id",
#       db.INTEGER,
#       db.ForeignKey("playlists.id"),
#       primary_key=True
#   )
# )

class User(db.Model, UserMixin):
  __tablename__ = 'users'

  id = db.Column(db.Integer, primary_key = True)
  first_name = db.Column(db.String(40), nullable = False)
  last_name = db.Column(db.String(40), nullable = False)
  email = db.Column(db.String(255), nullable = False, unique = True)
  hashed_password = db.Column(db.String(255), nullable = False)
  profile_url = db.Column(db.String(255), nullable = False, unique = True)
  banner_url = db.Column(db.String(255), nullable = False, unique = True)

  song = db.relationship("Song", back_populates="user")
  comments = db.relationship("Comment", back_populates="user")
  # playlist = db.relationship(
  #     "Playlist",
  #     secondary=join_playlist,
  #     back_populates="users"
  # )

  @property
  def password(self):
    return self.hashed_password


  @password.setter
  def password(self, password):
    self.hashed_password = generate_password_hash(password)


  def check_password(self, password):
    return check_password_hash(self.password, password)


  def to_dict(self):
    return {
      "id": self.id,
      "first_name": self.first_name,
      "last_name": self.last_name,
      "email": self.email,
    }
