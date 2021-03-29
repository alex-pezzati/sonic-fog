from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Comment, db


commentsList_routes = Blueprint('commentsList', __name__)

@commentsList_routes.route('/<int:songId>', methods=["GET"])
# @login_required
def commentsList(songId):
    comments = Comment.query.filter(Comment.song_id == songId).all()
    commentsList = [comment.to_dict() for comment in comments]
    if len(commentsList)==0: return
    return {'listOfComments':commentsList}
