import React from 'react';

function SongTile({ song }) {
    return (
        <div>
            <div>
                songs here
                {song.artist}
                {song.name}
            </div>
        </div>
    )
}

export default SongTile;
