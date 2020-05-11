import React, { useEffect, useRef, useState, FC } from 'react';
import Hls from 'hls.js';
import { MediaContext, MediaStat } from './MediaContext';

interface MediaProviderProps {
  mediaSource: string;
}

export const MediaProvider: FC<MediaProviderProps> = ({
  children,
  mediaSource,
}) => {
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const hlsRef = useRef<Hls>(null);
  const [levels, updateLevels] = useState<Hls.Level[]>([]);
  const [buffered, updateBuffered] = useState<TimeRanges | null>(null);
  const [currentTime, updateCurrentTime] = useState(0);
  const [duration, updateDuration] = useState(0);
  const [ended, updateEnded] = useState(false);
  const [paused, updatePaused] = useState(true);
  const [playbackRate, updatePlaybackRate] = useState(1);
  const [volume, updateVolume] = useState(1);
  const [muted, updateMuted] = useState(false);
  const [isLoading, updateIsLoading] = useState(true);
  const [fps, setFps] = useState(0);

  const _getMedia = () => {
    const media = mediaRef.current;
    if (!media) {
      throw new Error('media element is not available');
    }
    return media;
  };

  const getMediaStat = (): MediaStat => {
    const media = _getMedia();
    return {
      duration: media.duration,
      currentTime: media.currentTime,
      paused: media.paused,
      ended: media.ended,
      volume: media.volume,
      playbackRate: media.playbackRate,
      muted: media.muted,
      mediaWidth: media instanceof HTMLVideoElement ? media.videoWidth : 0,
      mediaHeight: media instanceof HTMLVideoElement ? media.videoHeight : 0,
    };
  };

  const _getHls = () => {
    const hls = hlsRef.current;
    if (!hls) {
      throw new Error('HLS instance is not available');
    }
    return hls;
  };

  const releaseHlsResource = () => {
    const hls = hlsRef.current;
    if (hls) {
      hls.destroy();
    }
  };

  useEffect(() => {
    const media = _getMedia();
    releaseHlsResource();

    if (Hls.isSupported()) {
      const newHls = new Hls();
      newHls.attachMedia(media as HTMLVideoElement);
      newHls.on(Hls.Events.MEDIA_ATTACHED, () => {
        newHls.loadSource(mediaSource);
      });

      newHls.on(Hls.Events.FRAG_BUFFERED, () => {
        updateBuffered(_getMedia().buffered);
      });

      newHls.on(Hls.Events.FRAG_CHANGED, () => {
        if (checkMediaHasDataToPlay()) {
          updateIsLoading(false);
        }
      });

      newHls.on(Hls.Events.FRAG_PARSING_DATA, (_, data) => {
        if (data.type === 'video') {
          const fps = data.nb / (data.endPTS - data.startPTS);
          setFps(Math.round(fps));
        }
      });

      newHls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        updateLevels((data.levels as unknown) as Hls.Level[]);
      });

      (hlsRef.current as any) = newHls;
      (window as any).hls = newHls;
    } else if (media && media.canPlayType('application/vnd.apple.mpegurl')) {
      // For native support like Apple's safari
      media.src = mediaSource;
    }

    return releaseHlsResource;
  }, [mediaSource]);

  const setLevel = (level: number = -1) => {
    const hlsInstance = _getHls();
    hlsInstance.currentLevel = level;
  };

  const checkMediaHasDataToPlay = () => {
    const media = _getMedia();
    const currentTime = media.currentTime;
    const timeRanges = Array.from(
      { length: media.buffered.length },
      (_, index) => {
        return [media.buffered.start(index), media.buffered.end(index)];
      }
    );

    return timeRanges.some(timeRange => {
      const [start, end] = timeRange;
      return currentTime >= start && currentTime <= end;
    });
  };

  const _onSeeking = () => {
    const media = _getMedia();
    updateCurrentTime(media.currentTime);
    if (!checkMediaHasDataToPlay()) {
      updateIsLoading(true);
    }
  };

  const _onLoadedMetadata = async () => {
    while (_getMedia().duration === Infinity) {
      // Loop until duration is ready
      await new Promise(res => setTimeout(res, 100));
    }

    updateDuration(_getMedia().duration);
  };

  const _onRateChange = () => updatePlaybackRate(_getMedia().playbackRate);

  const _onVolumeChange = () => {
    const media = _getMedia();
    updateMuted(media.muted);
    updateVolume(media.volume);
  };

  const _onPause = () => updatePaused(true);

  const _onPlay = () => {
    updatePaused(false);
    updateEnded(false);
  };

  const _onCanPlay = () => updateIsLoading(false);

  const _onEmptied = () => updateIsLoading(true);

  const _onWaiting = () => {
    if (!checkMediaHasDataToPlay()) {
      updateIsLoading(true);
    }
  };

  const _onTimeUpdate = () => updateCurrentTime(_getMedia().currentTime);

  const _onEnded = () => updateEnded(true);

  const setCurrentTime = (newCurrentTime: number) =>
    (_getMedia().currentTime = Math.min(
      Math.max(newCurrentTime, 0),
      _getMedia().duration
    ));

  const setPlaybackRate = (newPlaybackRate: number) => {
    _getMedia().playbackRate = newPlaybackRate;
  };

  const setVolume = (newVolume: number) => (_getMedia().volume = newVolume);

  const toggleMuted = () => (_getMedia().muted = !_getMedia().muted);

  const togglePlay = async () => {
    const media = _getMedia();
    if (media.paused) {
      (playPromiseRef.current as any) = media.play();
    } else {
      if (playPromiseRef.current) {
        await playPromiseRef.current;
        media.pause();
        playPromiseRef.current = null;
      } else {
        // For IE's weirdness
        media.pause();
      }
    }
  };

  return (
    <MediaContext.Provider
      value={{
        mediaRef,
        getMediaStat,
        fps,

        // Streaming properties
        levels,
        setLevel,

        // Media properties
        currentTime,
        duration,
        isLoading,
        paused,
        playbackRate,
        volume,
        ended,
        muted,
        buffered,

        // Media methods
        setCurrentTime,
        setPlaybackRate,
        setVolume,
        toggleMuted,
        togglePlay,

        // Media event listeners
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
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};
