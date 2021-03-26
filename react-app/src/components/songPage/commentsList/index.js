import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import classes from "./commentsList.module.css";

function Index() {
  const [list, setList] = useState([]);
  const [ownerId, setOwnerId] = useState([]);
  const [owner, setOwner] = useState([]);
  const [url, setUrl] = useState([]);
  const { songId } = useParams();

  useEffect(() => {
    if (!songId) return;
    async function fetchData() {
      const response = await fetch(`/api/comments/${songId}`);
      if (response.ok) {
        const { listOfComments } = await response.json();
        setList(listOfComments);
        const usersList = listOfComments.map((comment) => {
          return comment.userId;
        });
        setOwnerId(usersList);
      } else {
        console.log("error", response);
      }
    }
    fetchData();
  }, [songId]);

  useEffect(() => {
    const userHolder = [];
    async function fetchData(id) {
      const response = await fetch(`/api/users/${id}`);
      if (response.ok) {
        const { display_name, profile_url } = await response.json();
        setOwner([...owner, display_name]);
        setUrl([...url, profile_url]);
      } else {
        console.log("error with fetching users");
      }
    }
    ownerId.forEach((id) => fetchData(id));
    setOwner(userHolder);
  }, [ownerId]);

  console.log(owner);
  // if (!list) return null;
  return (
    <ul className={classes.Comments__container}>
      {list.map((comment, i) => (
        <li className={classes.Comments}>
          <div></div>
          <span className={classes.Owner}>
            <img src={url[i]} alt="" className={classes.Photo}></img>@{owner}
          </span>
          <span className={classes}>{comment.comment}</span>
        </li>
      ))}
    </ul>
  );
}

export default Index;
