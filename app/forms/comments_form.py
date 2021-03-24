from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired
from app.models import Comment


class CommentForm(FlaskForm):
    comment = StringField('comment', validators=[DataRequired()])
    post = SubmitField("post comment")
