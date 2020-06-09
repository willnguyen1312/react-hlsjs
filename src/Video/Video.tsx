import React, { useCallback, FC, useEffect } from 'react';
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
    _onProgress,
    buffered,
    fps,
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

  useEffect(() => {
    var checkInterval = 250; // check every 50 ms (do not use lower values)
    var lastPlayPos = 0;
    var lastDiff = 0;
    var currentPlayPos = 0;
    var bufferingDetected = false;
    var player = mediaRef.current as HTMLVideoElement;

    setInterval(checkBuffering, checkInterval);
    function checkBuffering() {
      currentPlayPos = player.currentTime;

      var newDiff = currentPlayPos - lastPlayPos;

      if (lastDiff !== newDiff) {
        // console.log(lastDiff);
        lastDiff = newDiff;
      }

      // if no buffering is currently detected,
      // and the position does not seem to increase
      // and the player isn't manually paused...
      if (
        !bufferingDetected &&
        currentPlayPos <= lastPlayPos &&
        !player.paused
      ) {
        console.log('buffering');
        bufferingDetected = true;
      }

      // if we were buffering but the player has advanced,
      // then there is no buffering
      if (bufferingDetected && currentPlayPos > lastPlayPos && !player.paused) {
        console.log('not buffering anymore');
        bufferingDetected = false;
      }
      lastPlayPos = currentPlayPos;
    }
  }, []);

  return (
    <div>
      <h1>{`Hello Video ${isLoading ? 'Loading' : ''}`}</h1>
      <video
        onProgress={() => {
          // console.log("On Progress")
          _onProgress();
        }}
        onSeeking={event => {
          callAll(_onSeeking, onSeeking);
          // console.log('seeking');
          console.log((event.target as HTMLVideoElement).currentTime);
        }}
        onLoadedMetadata={callAll(_onLoadedMetadata, onLoadedMetadata)}
        onRateChange={callAll(_onRateChange, onRateChange)}
        onVolumeChange={callAll(_onVolumeChange, onVolumeChange)}
        onCanPlay={callAll(_onCanPlay, onCanPlay)}
        onWaiting={callAll(_onWaiting, onWaiting)}
        onPause={callAll(_onPause, onPause)}
        onPlay={callAll(_onPlay, onPlay)}
        onTimeUpdate={() => {
          callAll(_onTimeUpdate, onTimeUpdate);
          // console.log('timeupdate');
        }}
        onEmptied={callAll(_onEmptied, onEmptied)}
        onEnded={() => {
          console.log('Ended');
          callAll(_onEnded, onEnded);
        }}
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
              return [
                Math.round(buffered.start(index)),
                Math.round(buffered.end(index)),
              ];
            }
          );

          return timeRanges.map(timeRange => JSON.stringify(timeRange));
        })()}
      {fps !== 0 && <p>{`Fps: ${fps}`}</p>}
    </div>
  );
};
