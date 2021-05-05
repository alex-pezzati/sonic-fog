import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Waveform from "../../waveform/index";
import Waveformbtn from "../../waveformControls/index";
import classes from "./songpage.module.css";

function Index() {
  const { songId } = useParams();
  const [song, setSong] = useState(null);

  useEffect(() => {
    if (!songId) {
      return;
    }
    (async () => {
      console.log(songId)
      const response = await fetch(`/api/songs/${songId}`);
      if (!response.ok) return console.log("error fetching song");
      const fetched_song = await response.json();
      await setSong(fetched_song);
      return fetched_song;
    })();
  }, [songId]);

  if (!song) {
    return <h1>song not found</h1>;
  }

  const albumCoverStyle = {
    background: `url(${song.albumPhoto}) center no-repeat`,
  };

  return (
    <div className={classes.Song_body}>
      <div className={classes.Song_banner__outercontainer}>
        <fieldset className={classes.Song_banner__container}>
          <legend className={classes.Song_upload_date__container}>
            <h5>
              {song.releaseDate !== "None" ? song.releaseDate : "time holder"}
            </h5>
          </legend>
          <fieldset className={classes.Song_banner__innercontainer}>
            <h5 className={classes.Song_uploader}>{song.uploaderName}</h5>
            <h3 className={classes.Song_name}>{song.songName}</h3>
            <div className={classes.play_btn__container}>
              <Waveformbtn songId={song.id} />
            </div>
            <div onClick={Waveform.togglePlaying}>
              <Waveform
                songId={Number(song.id)}
                canvasWidth={680}
                canvasHeight={60}
              />
            </div>
          </fieldset>
          <div>
            <div
              style={albumCoverStyle}
              className={classes.Album_Cover_image}
            ></div>
          </div>
        </fieldset>
      </div>
    </div>
  );
}

export default Index;
