import React, { useState, useEffect } from "react";
import BannerComponent from "./songBanner/index";
import PostCommentRoute from "./addComment/index";
import CommentListRoute from "./commentsList/index";
import classes from "./songPage.module.css";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

function SongPageRoute() {
  let { songId } = useParams();
  const [song, setSong] = useState(null);
  const [comments, setComments] = useState([]);
  songId = Number(songId);
  const user = useSelector((state) => state.session.user);

  // When a user first navigates to a song page, they should be at the top of the page.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!songId) {
      return;
    }
    (async () => {
      const response = await fetch(`/api/songs/${songId}`);
      if (!response.ok) return console.log("error fetching song");
      const fetched_song = await response.json();
      setSong(fetched_song);
      const commentResponse = await fetch(`/api/comments/${songId}`);
      if (commentResponse.ok) {
        let { listOfComments } = await commentResponse.json();
        setComments(listOfComments);
      }
      return fetched_song;
    })();
  }, [songId]);

  return (
    <div className={classes.SongPage_body}>
      <fieldset>
        <div className={classes.BannerComponent}>
          <BannerComponent song={song} />
        </div>
      </fieldset>
      {/* This will break for unauthorized users */}
      <fieldset>
        <div className={classes.inner_container}>
          {user ? <PostCommentRoute setComments={setComments} /> : <div className={classes.block}>Login to Leave a comment!</div>}
          <div className={classes.CommentsList}>
            <CommentListRoute comments={comments} />
          </div>
        </div>
      </fieldset>
    </div>
  );
}

export default SongPageRoute;
