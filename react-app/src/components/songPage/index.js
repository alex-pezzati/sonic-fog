import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AudioPlayer from "../audioPlayer/index";
import classes from "./songpage.module.css";

function Index() {
  const { songId } = useParams();
  const [song, setSong] = useState(null);

  useEffect(() => {
    if (!songId) {
      return;
    }
    (async () => {
      const response = await fetch(`/api/song/${songId}`);
      const fetched_song = await response.json();
      await setSong(fetched_song);
      return fetched_song;
    })();
  }, [songId]);
  console.dir(song);
  if (!song) {
    return null;
  }

  const albumCoverStyle = {
    background: `url(${song.albumPhoto}) center no-repeat`,
  };
  return (
    <span className={classes.Song_body}>
      <div className={classes.Song_banner__container}>
        <div className={classes.Song_headers}>
          <div className={classes.Song_uploader_name__container}>
            <span className={classes.Song_uploader__span}>
              {song.uploaderName}
            </span>
          </div>
          <div className={classes.Song_name__conatainer}>
            <span className={classes.Song_name__span}>{song.songName}</span>
          </div>
        </div>
        <div className={classes.Song_upload_date__container}>
          <span className={classes.Song_upload_date}>
            {song.releaseDate !== "None" ? song.releaseDate : "time holder"}
          </span>
        </div>
        <div className={classes.Song_player__container}>
          <AudioPlayer songId={song.id} canvasWidth={880} canvasHeight={150} />
        </div>
        <span className={classes.Song_album_cover_photo__container}>
          <span
            style={albumCoverStyle}
            className={classes.Album_Cover_image}
          ></span>
        </span>
      </div>
    </span>
  );
}

export default Index;
