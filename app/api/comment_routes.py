from flask import Blueprint, jsonify, request, redirect
from flask_login import login_required, current_user
from app.models import Comment, Song, db
from app.forms import CommentForm

comment_routes = Blueprint('comments', __name__)


@comment_routes.route("/<song_id>", methods=["POST", "GET"])
@login_required
def comment(song_id):
   comment = CommentForm()
   comment['csrf_token'].data = request.cookies['csrf_token']
   if comment.validate_on_submit():
      new_comment = Comment(
         user_id=current_user.id,
         song_id=song_id,
         comment=comment.data['comment']
      )
      db.session.add(new_comment)
      db.session.commit()
      return {'comments': comment.data['comment']}
   return redirect("/")
