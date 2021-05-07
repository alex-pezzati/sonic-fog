from .db import db
from .user import User

class Comment(db.Model):
    __tablename__ = "comments"
    id = db.Column(db.INTEGER, primary_key=True)
    user_id = db.Column(db.INTEGER, db.ForeignKey("users.id"))
    song_id = db.Column(db.INTEGER, db.ForeignKey("songs.id"))
    comment = db.Column(db.TEXT, nullable=False)
    user = db.relationship("User", back_populates="comments")
    song = db.relationship("Song", back_populates="comments")

    def to_dict(self):
        user = User.query.get(self.user_id)
        return {
            "id": self.id,
            "user": user.public(),
            "songId": self.song_id,
            "comment": self.comment,
        }
