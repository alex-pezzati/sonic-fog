import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import classes from "./commentsList.module.css";

function Index() {
  const [list, setList] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const [commenters, setCommenters] = useState([]);
  const { songId } = useParams();

  useEffect(() => {
    if (!songId) return;
    async function fetchData() {
      const response = await fetch(`/api/comments/${songId}`);
      if (response.ok) {
        const { listOfComments } = await response.json();
        // console.log(listOfComments);
        const comments = listOfComments.map((comment) => comment.comment);
        const users = listOfComments.map((comment) => comment.userId);
        setList(comments);
        setUserIds(users);
      } else {
        console.log("error");
      }
    }
    fetchData();
  }, [songId]);
  // console.log(list);
  // console.log(userIds);
  // console.log(commenters);
  useEffect(() => {
    if (!userIds) return;
    async function fetchData(id) {
      const res = await fetch(`/api/users/${id}`);
      if (res.ok) {
        const user = await res.json();
        setCommenters((commenters) => [...commenters, user]);
      } else {
        console.log(`failed to fetch user at ${id}`);
      }
    }
    userIds.forEach((id) => fetchData(id));
  }, [userIds]);
  if (commenters.length === list.length) {
    // console.log("yes");
    return (
      <div className={classes.Comment_Outer_Container}>
        <ul className={classes.Outter_box}>
          {commenters.map((user, i) => {
            const userPhoto = {
              backgroundImage: `url(${user.profile_url})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            };
            return (
              <li key={user.display_name + i} className={classes.Comment_Box}>
                <fieldset>
                  <legend>@{user.display_name}</legend>
                  <a href={`/users/${user.id}`}>
                    <div
                      className={classes.Image__container}
                      style={userPhoto}
                    ></div>
                  </a>
                  <div className={classes.Single_Comment}>
                    <p>{list[i]}</p>
                  </div>
                </fieldset>
              </li>
            );
          })}
        </ul>
      </div>
    );
  } else {
    return <div className={classes.block}></div>;
  }
}

export default Index;
