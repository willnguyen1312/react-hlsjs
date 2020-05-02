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
      <h1 style={{ textAlign: 'center' }}>Hello Video</h1>
      <video
        {...mediaEventHandlers}
        controls
        style={{
          width: '100%',
          height: 600,
        }}
        ref={mediaRef as React.RefObject<HTMLVideoElement>}
      />
      <button onClick={togglePlay}>{paused ? 'Play' : 'Pause'}</button>
      <p>{`PlaybackRate: ${playbackRate}`}</p>
      <p>{!!duration && `Duration ${duration}`}</p>
      <button onClick={changePlaybackRate}>Change playbackRate</button>
      <button onClick={changeVolume}>Change volume</button>
      <p>{isLoading && 'Loading'}</p>
      <p>{`Volume: ${volume}`}</p>
      <p>{currentTime}</p>
    </div>
  );
};
