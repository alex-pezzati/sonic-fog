from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Comment, Song, db

comment_routes = Blueprint('comment', __name__)

@comment_routes.route('/<int:songId>', methods=["POST"])
@login_required
def comment(songId):
    if "comment" not in request.form:
        return {"errors": "comment required"}, 400
    song = Song.query.get(songId)
    comment = request.form['comment']
    new_comment = Comment(user_id=current_user.id, song_id=songId, comment=comment)
    db.session.add(new_comment)
    db.session.commit()
    return {"comment":comment}
