import React from 'react';
import { useMediaContext } from './MediaContext';

export const Audio = () => {
  const {
    getMedia,
    onSeeking,
    onSeeked,
    onLoadedMetadata,
    onRateChange,
    onVolumeChange,
    onCanPlay,
    onWaiting,
    onPause,
    onTimeUpdate,
    onPlay,
    mediaRef,
    paused,
    playbackRate,
    duration,
    isLoading,
    currentTime,
    volume,
  } = useMediaContext();

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
        onSeeking={onSeeking}
        onSeeked={onSeeked}
        onLoadedMetadata={onLoadedMetadata}
        onRateChange={onRateChange}
        onVolumeChange={onVolumeChange}
        onCanPlay={onCanPlay}
        onWaiting={onWaiting}
        onPause={onPause}
        onPlay={onPlay}
        onTimeUpdate={onTimeUpdate}
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
      <p>{currentTime}</p>
    </div>
  );
};
