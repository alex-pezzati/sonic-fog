import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const Comment = ({ song_id }) => {
  const history = useHistory(); // so that we can redirect after the image upload is successful
  const [comment, setComment] = useState(null);
  const [postLoading, setPostLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("comment", comment);
    // aws uploads can be a bit slow—displaying
    // some sort of loading message is a good idea
    setPostLoading(true);

    const res = await fetch(`/api/comment/${song_id}`, {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      await res.json();
      setPostLoading(false);
      history.push("/");
    } else {
      setPostLoading(false);
      // a real app would probably use more advanced
      // error handling
      console.log("error");
    }
  };

  const updatePost = (e) => {
    const form_comment = e.target.value;
    setComment(form_comment);
  };

  return (
    <ul>
      <form onSubmit={handleSubmit}>
        <li>
          <div>
            <label for="comment">Post a comment here</label>
          </div>
          <input
            type="text"
            value={comment}
            onChange={updatePost}
            name="comment"
          />
        </li>
        <button type="submit">post comment</button>
        {postLoading && <p>Posting...</p>}
      </form>
    </ul>
  );
};

export default Comment;
