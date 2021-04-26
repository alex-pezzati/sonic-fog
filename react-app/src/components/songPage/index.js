import React from "react";
import BannerComponent from "./songBanner/index";
// import PostCommentRoute from "./addComment/index";
import CommentListRoute from "./commentsList/index";
import classes from "./songPage.module.css";

function SongPageRoute() {
  return (
    <div className={classes.SongPage_body}>
      <div className={classes.BannerComponent}>
        <BannerComponent />
      </div>
      {/* This will break for unauthorized users */}
      {/* <div className={classes.CommentComponent}>
        <PostCommentRoute />
      </div> */}
      <div className={classes.inner_container}>
        <div className={classes.CommentsList}>
          <CommentListRoute />
        </div>
      </div>
    </div>
  );
}

export default SongPageRoute;
