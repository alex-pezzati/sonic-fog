import React from "react";
import BannerComponent from "./songBanner/index";
import PostCommentRoute from "./addComment/index";
import classes from "./songPage.module.css";

function SongPageRoute() {
  return (
    <div className={classes.SongPage_body}>
      <div className={classes.BannerComponent}>
        <BannerComponent />
      </div>
      <div className={classes.CommentComponent}>
        <PostCommentRoute />
      </div>
    </div>
  );
}

export default SongPageRoute;
