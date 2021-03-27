import React, { useState } from "react";
import { Redirect, useParams, useHistory } from "react-router-dom";
import classes from "./addComment.module.css";
import { useSelector } from "react-redux";
function PostCommentRoute() {
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);
  const [comment, setComment] = useState(null);
  const { songId } = useParams();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("comment", comment);

    const res = await fetch(`/api/comment/${songId}`, {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      await res.json();
      history.push(`/songs/${songId}`);
    } else {
      console.log("error");
    }
  };
  const userPhoto = {
    background: `url(${sessionUser.profile_url}) center no-repeat`,
  };
  return (
    <div>
      <div className={classes.profileImage__container} style={userPhoto}></div>
      <form className={classes.formField} onSubmit={handleSubmit}>
        <div className={classes.inputField__container}>
          <input
            type="text"
            value={comment}
            placeholder="Write a comment"
            className={classes.inputField}
            onChange={(e) => setComment(e.target.value)}
          ></input>
        </div>
      </form>
    </div>
  );
}

export default PostCommentRoute;
