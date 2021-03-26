import React, { useState } from "react";
import { Redirect, useParams, useHistory } from "react-router-dom";
import classes from "./addComment.module.css";

function PostCommentRoute() {
  const history = useHistory();
  const [comment, setComment] = useState(null);
  const [posting, setPosting] = useState(false);
  const { songId } = useParams();
  console.log(songId);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("comment", comment);

    setPosting(true);

    const res = await fetch(`/api/comment/${songId}`, {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      await res.json();
      setPosting(false);
      history.push("/");
    } else {
      setPosting(false);
      console.log("error");
    }
  };
  return (
    <div>
      <div className={classes.profileImage__container}></div>
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
