import React, { FC } from 'react';
import { _useMediaContext, MediaProps } from '../MediaContext';
import { callAll } from '../utils';

export const Audio: FC<MediaProps> = ({
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
    levels,
    setLevel,
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
    togglePlay,
    setPlaybackRate,
    setVolume,
  } = _useMediaContext();

  const changePlaybackRate = () => {
    playbackRate === 1 ? setPlaybackRate(2) : setPlaybackRate(1);
  };

  const changeVolume = () => {
    volume === 1 ? setVolume(0) : setVolume(1);
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Hello Audio</h1>
      <audio
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
