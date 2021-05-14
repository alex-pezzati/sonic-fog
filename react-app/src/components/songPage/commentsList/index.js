import React from "react";
import classes from "./commentsList.module.css";

function Index({ comments }) {
  if (comments.length) {
    return (
      <div className={classes.Comment_Outer_Container}>
        <ul className={classes.Outter_box}>
          {comments.map((ele, i) => {
            let user = ele.user;
            // const userPhoto = {
            //   backgroundImage: `url(${user.profile_url})`,
            //   backgroundSize: "cover",
            //   backgroundRepeat: "no-repeat",
            //   backgroundPosition: "center",
            // };
            return (
              <li key={user.display_name + i} className={classes.Comment_Box}>
                <fieldset>
                  <legend>@{user.display_name}</legend>
                  <a href={`/users/${user.id}`}>
                    <img src={user.profile_url} alt='profile' className={classes.profilePic}></img>
                  </a>
                  <div className={classes.Single_Comment}>
                    <p>{ele.comment}</p>
                  </div>
                </fieldset>
              </li>
            );
          })}
        </ul>
      </div>
    );
  } else {
    return (
      <div className={classes.block}>
        Looks like this song doesn't have any comments. Start the conversation!
      </div>
    )
  }
}

export default Index;
