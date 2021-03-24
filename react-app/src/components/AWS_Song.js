import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const UploadSong = () => {
  const history = useHistory(); // so that we can redirect after the image upload is successful
  const [song, setSong] = useState(null);
  const [name, setName] = useState(null);
  const [songLoading, setSongLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("song", song);
    formData.append("name", name);

    // aws uploads can be a bit slow—displaying
    // some sort of loading message is a good idea
    setSongLoading(true);

    const res = await fetch("/api/song", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      await res.json();
      setSongLoading(false);
      history.push(`/song/${name}`);
    } else {
      setSongLoading(false);
      // a real app would probably use more advanced
      // error handling
      console.log("error");
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

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="audio/*" onChange={updateSong} />
      <input type="text" onChange={updateName} placeholder="Song title" />
      <button type="submit">Upload</button>
      {songLoading && <p>Loading...</p>}
    </form>
  );
};

export default UploadSong;
