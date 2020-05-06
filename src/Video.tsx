import React, { useCallback } from 'react';
import { _useMediaContext } from './MediaContext';
import { useEventListener } from './hooks/useEventListener';

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
    muted,
    levels,
    setLevel,
    setCurrentTime,
    togglePlay,
    toggleMuted,
  } = _useMediaContext();

  // Add event listener using our hook
  useEventListener(
    'keypress',
    useCallback(
      ({ key }) => {
        if (key === 'n') {
          setCurrentTime(currentTime + 3);
        }

        if (key === 'p') {
          setCurrentTime(currentTime - 3);
        }

        if (key === 's') {
          togglePlay();
        }

        if (key === 'm') {
          toggleMuted();
        }
      },
      [setCurrentTime]
    )
  );

  const changePlaybackRate = () => {
    const video = getMedia();
    const currentPlaybackRate = video.playbackRate;

    currentPlaybackRate === 1
      ? (video.playbackRate = 2)
      : (video.playbackRate = 1);
  };

  return (
    <div>
      <h1>Hello Video</h1>
      <video
        {...mediaEventHandlers}
        controls
        style={{
          margin: 'left',
          height: 400,
          display: 'block',
        }}
        ref={mediaRef as React.RefObject<HTMLVideoElement>}
      />
      <button onClick={togglePlay}>{paused ? 'Play' : 'Pause'}</button>
      <button onClick={changePlaybackRate}>Change playbackRate</button>
      <button onClick={toggleMuted}>Toggle muted</button>
      <p>{`PlaybackRate: ${playbackRate}`}</p>
      <p>{!!duration && `Duration ${duration}`}</p>
      <p>{`Volume: ${volume}`}</p>
      <p>{`Muted: ${muted}`}</p>
      <p>{`Current time: ${currentTime}`}</p>
      <p>Resolution</p>
      <div style={{ display: 'flex' }}>
        <button onClick={() => setLevel()}>Auto</button>
        {levels.map((level, index) => (
          <button key={level.name} onClick={() => setLevel(index)}>
            {level.name}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <button onClick={() => setCurrentTime(currentTime - 3)}>
          Prev 3 secconds
        </button>
        <button onClick={() => setCurrentTime(currentTime + 3)}>
          Next 3 secconds
        </button>
      </div>
      <p>{isLoading && 'Loading'}</p>
    </div>
  );
};
