import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import c from './SongUploadForm.module.css'

const UploadSong = () => {
  const history = useHistory(); // so that we can redirect after the image upload is successful
  const [song, setSong] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [songLoading, setSongLoading] = useState(false);

  //Error handling
  const [albumCoverError, setAlbumCoverError] = useState('')
  const [songFileError, setSongFileError] = useState('')
  const [songNameError, setSongNameError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("song_file", song);
    formData.append("song_name", name);
    formData.append("album_cover", image);

    // aws uploads can be a bit slow—displaying
    // some sort of loading message is a good idea
    setSongLoading(true);

    const res = await fetch("/api/songs", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      let id = await res.json();
      id = id.id
      setSongLoading(false);
      history.push(`/songs/${id}`);
    } else {
      let errors = await res.json()
      setSongLoading(false);

      let error_obj = {}
      errors.errors.forEach(error => {
        let key_idx = error.indexOf(':')
        let key = error.slice(0, key_idx)
        let val = error.slice(key_idx+1)

        key = key.trim()
        val = val.trim()

        error_obj[key] = val
      });

      error_obj['album_cover'] ? setAlbumCoverError(error_obj['album_cover']) : setAlbumCoverError('')
      error_obj['song_file']? setSongFileError(error_obj['song_file']) : setSongFileError('')
      error_obj['song_name'] ? setSongNameError(error_obj['song_name']) : setSongNameError('')

    }
  };


  const updateSong = (e) => {
    const file = e.target.files[0];
    setSong(file);
  };
  const updateName = (e) => {
    const songName = e.target.value;
    setName(songName);
  };
  const updateImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  return (
    <div className={c.form_parent}>
      <form onSubmit={handleSubmit} className={c.submit_form}>
        <label className={c.label}>Song File</label>
        <div className={c.error_message}>{songFileError}</div>
        <input
          name="song_file"
          type="file"
          accept="audio/*"
          onChange={updateSong}
          className={c.song_file}
        />
        <label className={c.label}>Album Cover</label>
        <div className={c.error_message}>{albumCoverError}</div>
        <input
          name='album_cover'
          type="file"
          accept="image/*"
          onChange={updateImage}
          className={c.album_cover}

        />
        <label className={c.label}>Song Title</label>
        <div className={c.error_message}>{songNameError}</div>
        <input
          name='song_name'
          type="text"
          value={name ? name : ""}
          onChange={updateName}
          placeholder='"Fergalicious Definitious"'
          className={c.song_title}
        />
        <button type="submit" className={c.upload_button}>Upload Song</button>
        {songLoading && <p className={c.loading_message}>Loading...</p>}
      </form>
    </div>
  );
};

export default UploadSong;
