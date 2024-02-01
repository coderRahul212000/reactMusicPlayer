import React, { useState, useEffect } from 'react';

const AudioPlayer = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [audio, setAudio] = useState(new Audio());
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    // Load the playlist from local storage on page load
    const savedPlaylist = JSON.parse(localStorage.getItem('playlist')) || [];
    setPlaylist(savedPlaylist);

    // Load the last playing audio file and continue playing from the last position
    const savedCurrentTrackIndex = localStorage.getItem('currentTrackIndex');
    if (savedCurrentTrackIndex !== null) {
      setCurrentTrackIndex(parseInt(savedCurrentTrackIndex, 10));
    }

    const savedCurrentTime = localStorage.getItem('currentTime');
    if (savedCurrentTime !== null) {
      setCurrentTime(parseFloat(savedCurrentTime));
    }
  }, []);

  useEffect(() => {
    // Save playlist to local storage whenever it changes
    localStorage.setItem('playlist', JSON.stringify(playlist));
  }, [playlist]);

  useEffect(() => {
    // Save the current track index and current time to local storage
    localStorage.setItem('currentTrackIndex', currentTrackIndex);
    localStorage.setItem('currentTime', currentTime);
  }, [currentTrackIndex, currentTime]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Update the playlist
    setPlaylist([...playlist, { name: file.name, src: URL.createObjectURL(file) }]);
  };

  const handlePlay = () => {
    audio.src = playlist[currentTrackIndex].src;
    audio.currentTime = currentTime;
    audio.play();
  };

  const handlePause = () => {
    audio.pause();
    setCurrentTime(audio.currentTime);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audio.currentTime);
  };

  return (
    <div>
      <input type="file" accept=".mp3" onChange={handleFileChange} />
      <button onClick={handlePlay}>Play</button>
      <button onClick={handlePause}>Pause</button>
      <button onClick={handleNext}>Next</button>

      <div>
        <h2>Playlist</h2>
        <ul>
          {playlist.map((track, index) => (
            <li key={index}>{track.name}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Now Playing</h2>
        <p>{playlist[currentTrackIndex]?.name}</p>
      </div>

      <audio
        controls
        onEnded={handleNext}
        onTimeUpdate={handleTimeUpdate}
      />
    </div>
  );
};

export default AudioPlayer;
