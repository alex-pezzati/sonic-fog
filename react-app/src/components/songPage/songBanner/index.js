import React, {useState, useEffect} from "react";
import Waveform from "../../waveform/index";
import Waveformbtn from "../../waveformControls/index";
import classes from "./songpage.module.css";

function Index({ song }) {

  const [waveformWidth, setWaveformWidth] = useState(900)

  useEffect(() => {
    const debounce = (callback, wait) => {
      let timeoutId = null;
      return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
          callback.apply(null, args);
        }, wait);
      };
    }
    function handleResize() {
      if (window.innerWidth < 1240){
        setWaveformWidth(window.innerWidth * .7)
      } else if (waveformWidth < 900){
        setWaveformWidth(900)
      }
    }
    const debouncedResize = debounce(handleResize, 250)

    window.addEventListener('resize', debouncedResize)

    return () => window.removeEventListener('resize', handleResize)
  })

  if (!song) {
    return null;
  }

//   return (
//     <div className={classes.Song_body}>
//       <div className={classes.Song_banner__outercontainer}>
//         <fieldset className={classes.Song_banner__container}>
//           <legend className={classes.Song_upload_date__container}>
//             <h5>
//               {song.releaseDate !== "None"
//                 ? song.releaseDate
//                 : new Date().toString()}
//             </h5>
//           </legend>
//           <fieldset className={classes.Song_banner__innercontainer}>
//             <h5 className={classes.Song_uploader}>{song.uploaderName}</h5>
//             <h3 className={classes.Song_name}>{song.songName}</h3>
//             <div className={classes.play_btn__container}>
//               <Waveformbtn songId={song.id} />
//             </div>
//             <div onClick={Waveform.togglePlaying}>
//               <Waveform
//                 songId={Number(song.id)}
//                 canvasWidth={screenWidth * .7}
//                 canvasHeight={60}
//               />
//             </div>
//           </fieldset>
//           <div>
//             <div
//               className={classes.Album_Cover_image}
//             >
//               <img src={song.albumPhoto} className={classes.album_cover} alt='album cover'></img>
//             </div>
//           </div>
//         </fieldset>
//       </div>
//     </div>
//   );
// }

return (
  <div className={classes.full_banner}>
    <div className={classes.song_left}>
      <div className={classes.song_left_top}>
        <div className={classes.play_btn__container}>
          <Waveformbtn songId={song.id} />
        </div>
        <div className={classes.song_left_top_right}>
          <div className={classes.artist_and_song_name}>
            <h5 className={classes.Song_uploader}>{song.uploaderName}</h5>
            <h3 className={classes.Song_name}>{song.songName}</h3>
          </div>
          <div>
            <h4>
              {song.releaseDate.split(' ')[0]}
            </h4>
          </div>
        </div>
      </div>
      <div onClick={Waveform.togglePlaying}>
          <Waveform
            songId={Number(song.id)}
            canvasWidth={waveformWidth}
            canvasHeight={60}
          />
      </div>
    </div>
    <div className={classes.song_right}>
      <div className={classes.album_cover_container}>
        <img src={song.albumPhoto} className={classes.album_cover} alt='album cover'></img>
      </div>
    </div>
  </div>
);
}

export default Index;
