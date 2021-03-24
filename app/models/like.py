from .db import db


class Like(db.Model):
    __tablename__ = "likes"
    id = db.Column(db.INTEGER, primary_key=True)
    user_id = db.Column(db.INTEGER, db.ForeignKey("users.id"))
    song_id = db.Column(db.INTEGER, db.ForeignKey("songs.id"))
    user = db.relationship("User", back_populates="likes")
    song = db.relationship("Song", back_populates="likes")
