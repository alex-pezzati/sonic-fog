from .db import db


class Song(db.Model):
    __tablename__ = "songs"
    id = db.Column(db.INTEGER, primary_key=True)
    user_id = db.Column(db.INTEGER, db.ForeignKey("users.id"))
    artist = db.Column(db.String(50))
    name = db.Column(db.String(50), nullable=False)
    url = db.Column(db.String(255), nullable=False)
    normalized_data = db.Column(db.TEXT)
    cover_image = db.Column(db.String(255))
    genre = db.Column(db.String(255))
    description = db.Column(db.TEXT)
    release_date = db.Column(db.DateTime())
    aws_unique_name = db.Column(db.String(255), unique=True)
    duration = db.Column(db.Numeric(5, 2))

    user = db.relationship("User", back_populates="song")
    comments = db.relationship("Comment", back_populates="song")
    likes = db.relationship("Like", back_populates="song")
