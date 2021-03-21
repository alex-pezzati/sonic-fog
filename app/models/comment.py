from .db import db

class Comment(db.Model):
   __tablename__ = "comments"
   id = db.Column(db.INTEGER, primary_key=True)
   user_id = db.Column(db.INTEGER, db.ForeignKey("users.id"))
   song_id = db.Column(db.INTEGER, db.ForeignKey("songs.id"))
   comment = db.Column(db.TEXT, nullable=False)

   user = db.relationship("User")
   song = db.relationship("Song")
