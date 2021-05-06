import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const UploadSong = () => {
  const history = useHistory(); // so that we can redirect after the image upload is successful
  const [song, setSong] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [songLoading, setSongLoading] = useState(false);

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

      // a real app would probably use more advanced
      // error handling
      console.log(errors);
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
    <form onSubmit={handleSubmit}>
      <input
        name="song_file"
        type="file"
        accept="audio/*"
        onChange={updateSong}
      />
      <input
        name='album_cover'
        type="file"
        accept="image/*"
        onChange={updateImage}
      />
      <input
        name='song_name'
        type="text"
        value={name ? name : ""}
        onChange={updateName}
        placeholder="Song title"
      />
      <button type="submit">Upload Song</button>
      {songLoading && <p>Loading...</p>}
    </form>
  );
};

export default UploadSong;
