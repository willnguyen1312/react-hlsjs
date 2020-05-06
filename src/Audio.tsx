import React from 'react';
import { _useMediaContext } from './MediaContext';

export const Audio = () => {
  const {
    getMedia,
    mediaRef,
    paused,
    playbackRate,
    duration,
    isLoading,
    currentTime,
    volume,
    mediaEventHandlers,
    levels,
    setLevel,
  } = _useMediaContext();

  const togglePlay = () => {
    const video = getMedia();
    video.paused ? video.play() : video.pause();
  };

  const changePlaybackRate = () => {
    const video = getMedia();
    const currentPlaybackRate = video.playbackRate;

    currentPlaybackRate === 1
      ? (video.playbackRate = 2)
      : (video.playbackRate = 1);
  };

  const changeVolume = () => {
    const video = getMedia();
    const currentVolume = video.volume;

    currentVolume === 1 ? (video.volume = 0) : (video.volume = 1);
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Hello Audio</h1>
      <audio
        {...mediaEventHandlers}
        controls
        style={{
          width: '100%',
        }}
        ref={mediaRef as React.RefObject<HTMLAudioElement>}
      />
      <button onClick={togglePlay}>{paused ? 'Play' : 'Pause'}</button>
      <p>{`PlaybackRate: ${playbackRate}`}</p>
      <p>{!!duration && `Duration ${duration}`}</p>
      <button onClick={changePlaybackRate}>Change playbackRate</button>
      <button onClick={changeVolume}>Change volume</button>
      <p>{isLoading && 'Loading'}</p>
      <p>{`Volume: ${volume}`}</p>
      <div style={{ display: 'flex' }}>
        <button onClick={() => setLevel()}>Auto</button>
        {levels.map((level, index) => (
          <button key={index} onClick={() => setLevel(index)}>
            {`${Math.round(level.bitrate / 1024)} kbp`}
          </button>
        ))}
      </div>
      <p>{currentTime}</p>
    </div>
  );
};
