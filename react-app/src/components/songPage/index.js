import React from "react";
import BannerComponent from "./songBanner/index";
import PostCommentRoute from "./addComment/index";
import CommentListRoute from "./commentsList/index";
import classes from "./songPage.module.css";
import { useSelector } from "react-redux";

function SongPageRoute() {
  const user = useSelector((state) => state.session.user);
  return (
    <div className={classes.SongPage_body}>
      <fieldset>
        <div className={classes.BannerComponent}>
          <BannerComponent />
        </div>
      </fieldset>
      {/* This will break for unauthorized users */}
      <fieldset>
        <div className={classes.inner_container}>
          {user ? <PostCommentRoute /> : null}
          <div className={classes.CommentsList}>
            <CommentListRoute />
          </div>
        </div>
      </fieldset>
    </div>
  );
}

export default SongPageRoute;
