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
  console.log(list);
  console.log(userIds);
  console.log(commenters);
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
    console.log("yes");
    return (
      <ul className={classes.Comments__container}>
        {commenters.map((user, i) => (
          <li
            key={user.display_name + i}
            className={classes.Inner_Comments__container}
          >
            <div className={classes.Image__container}>
              <img src={user.photo_url} alt="users profile"></img>
            </div>
            <div className={classes.User_Tag__container}>
              <h3 className={classes.User_Tag}>@{user.display_name}</h3>
            </div>
            <div className={classes.Single_Comment__container}>
              <span className={classes.Single_Comment}>{list[i]}</span>
            </div>
          </li>
        ))}
      </ul>
    );
  } else {
    return <h1>loading...</h1>;
  }
}

export default Index;
