from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User


def user_exists(form, field):
    print("Checking if user exits", field.data)
    email = field.data
    display_name = form.data["display_name"]
    user = User.query.filter(
        User.email == email or User.display_name == display_name
    ).first()
    if user:
        raise ValidationError("User is already registered.")


class SignUpForm(FlaskForm):
    display_name = StringField("display name", validators=[DataRequired()])
    email = StringField("email", validators=[DataRequired(), user_exists])
    password = StringField("password", validators=[DataRequired()])
