from .db import db


class Song(db.Model):
   __tablename__ = "songs"
   id = db.Column(db.INTEGER, primary_key=True)
   user_id = db.Column(db.INTEGER, db.ForeignKey("users.id"))
   artist = db.Column(db.String(50))
   name = db.Column(db.String(50), nullable=False)
   url = db.Column(db.String(255), nullable=False)
   duration = db.Column(db.String(255), nullable=False)
   cover_image = db.Column(db.String(255), nullable=False)
   genre = db.Column(db.String(255), nullable=False)
   description = db.Column(db.TEXT)
   release_date = db.Column(db.DateTime())

   user = db.relationship("User", back_populates="song")
   comments = db.relationship("Comment", back_populates="song")
   likes = db.relationship("Like", back_populates="song")
