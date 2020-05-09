import React, { useCallback, FC } from 'react';
import { _useMediaContext, MediaProps } from '../MediaContext';
import { useEventListener } from '../hooks/useEventListener';
import { callAll } from '../utils';

export const Video: FC<MediaProps> = ({
  onPlay,
  onCanPlay,
  onEmptied,
  onEnded,
  onLoadedMetadata,
  onPause,
  onRateChange,
  onSeeking,
  onTimeUpdate,
  onVolumeChange,
  onWaiting,
}) => {
  const {
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
    setPlaybackRate,
    togglePlay,
    toggleMuted,
    _onSeeking,
    _onLoadedMetadata,
    _onRateChange,
    _onVolumeChange,
    _onCanPlay,
    _onWaiting,
    _onPause,
    _onPlay,
    _onTimeUpdate,
    _onEmptied,
    _onEnded,
    buffered,
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
    playbackRate === 1 ? setPlaybackRate(2) : setPlaybackRate(1);
  };

  return (
    <div>
      <h1>Hello Video</h1>
      <video
        onSeeking={callAll(_onSeeking, onSeeking)}
        onLoadedMetadata={callAll(_onLoadedMetadata, onLoadedMetadata)}
        onRateChange={callAll(_onRateChange, onRateChange)}
        onVolumeChange={callAll(_onVolumeChange, onVolumeChange)}
        onCanPlay={callAll(_onCanPlay, onCanPlay)}
        onWaiting={callAll(_onWaiting, onWaiting)}
        onPause={callAll(_onPause, onPause)}
        onPlay={callAll(_onPlay, onPlay)}
        onTimeUpdate={callAll(_onTimeUpdate, onTimeUpdate)}
        onEmptied={callAll(_onEmptied, onEmptied)}
        onEnded={callAll(_onEnded, onEnded)}
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
          <button key={index} onClick={() => setLevel(index)}>
            {level.height}
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
      <p>Buffered Ranges:</p>
      {buffered &&
        buffered.length > 0 &&
        (() => {
          const timeRanges = Array.from(
            { length: buffered.length },
            (_, index) => {
              return [buffered.start(index), buffered.end(index)];
            }
          );

          return timeRanges.map(timeRange => JSON.stringify(timeRange));
        })()}
      <p>{isLoading && 'Loading'}</p>
    </div>
  );
};
