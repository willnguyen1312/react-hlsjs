import React from 'react';
import { _useMediaContext } from './MediaContext';

export const Video = () => {
  const {
    getMedia,
    mediaEventHandlers,
    mediaRef,
    paused,
    playbackRate,
    duration,
    isLoading,
    currentTime,
    volume,
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
      <h1>Hello Video</h1>
      <video
        {...mediaEventHandlers}
        controls
        autoPlay
        style={{
          margin: 'left',
          height: 400,
          display: 'block',
        }}
        ref={mediaRef as React.RefObject<HTMLVideoElement>}
      />
      <button onClick={togglePlay}>{paused ? 'Play' : 'Pause'}</button>
      <button onClick={changePlaybackRate}>Change playbackRate</button>
      <button onClick={changeVolume}>Change volume</button>
      <p>{`PlaybackRate: ${playbackRate}`}</p>
      <p>{!!duration && `Duration ${duration}`}</p>
      <p>{`Volume: ${volume}`}</p>
      <p>{`Current time: ${currentTime}`}</p>
      <p>{isLoading && 'Loading'}</p>
    </div>
  );
};
