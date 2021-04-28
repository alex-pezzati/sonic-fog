import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

// Styling
import classes from "./addComment.module.css";

function PostCommentRoute() {
  const sessionUser = useSelector((state) => state.session.user);
  const [comment, setComment] = useState(null);
  const [showLegend, setShowLegend] = useState(false);
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
      window.location.reload();
    } else {
      console.log("error");
    }
  };

  //quick fix and let it return null.
  const [userPhoto, setUserPhoto] = useState(null);
  useEffect(() => {
    if (sessionUser && sessionUser.profile_url) {
      setUserPhoto({
        background: `url(${sessionUser.profile_url}) no-repeat`,
        backgroundSize: "contain",
      });
    }
  }, [sessionUser]);
  return (
    <div className={classes.addComment_container}>
      <div className={classes.addComment_innercontainer}>
        <form onSubmit={handleSubmit}>
          <fieldset>
            {showLegend ? (
              <legend>Writting comment...</legend>
            ) : (
              <legend>{sessionUser.display_name}</legend>
            )}
            <div
              className={classes.profileImage__container}
              style={userPhoto}
            ></div>
            <div className={classes.inputField__container}>
              <input
                type="text"
                value={comment ? comment : ""}
                placeholder="Write a comment"
                onChange={(e) => {
                  if (e.target.value === "") {
                    setShowLegend(false);
                  } else {
                    setShowLegend(true);
                  }
                  return setComment(e.target.value);
                }}
              ></input>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

export default PostCommentRoute;
