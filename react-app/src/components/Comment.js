import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const Comment = () => {
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

    const res = await fetch("/api/comment", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      await res.json();
      setPostLoading(false);
      history.push("/comment");
    } else {
      setPostLoading(false);
      // a real app would probably use more advanced
      // error handling
      console.log("error");
    }
  };

  const updatePost = (e) => {
    const form_comment = e.target.files[0];
    setComment(form_comment);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label for="comment">Post a comment here</label>
      <input type="text" accept="text/*" onChange={updatePost} name="comment" />
      <button type="submit">post comment</button>
      {postLoading && <p>Loading...</p>}
    </form>
  );
};

export default Comment;
