import React, { useEffect, useRef, useState, FC } from 'react';
import Hls from 'hls.js';
import { MediaContext } from './MediaContext';

interface MediaProviderProps {
  mediaSource: string;
}

export const MediaProvider: FC<MediaProviderProps> = ({
  children,
  mediaSource,
}) => {
  const playPromiseRef = useRef<Promise<void>>(null);
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const hlsRef = useRef<Hls>(null);
  const [levels, updateLevels] = useState<Hls.Level[]>([]);
  const [currentTime, updateCurrentTime] = useState(0);
  const [duration, updateDuration] = useState(0);
  const [ended, updateEnded] = useState(false);
  const [paused, updatePaused] = useState(true);
  const [playbackRate, updatePlaybackRate] = useState(1);
  const [volume, updateVolume] = useState(1);
  const [muted, updateMuted] = useState(false);
  const [isLoading, updateIsLoading] = useState(true);

  const getMedia = () => {
    const media = mediaRef.current;
    if (!media) {
      throw new Error('media element is not available');
    }
    return media;
  };

  const getHls = () => {
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
    const media = getMedia();
    releaseHlsResource();

    if (Hls.isSupported()) {
      const newHls = new Hls();
      newHls.attachMedia(media as HTMLVideoElement);
      newHls.on(Hls.Events.MEDIA_ATTACHED, () => {
        newHls.loadSource(mediaSource);
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
    const hlsInstance = getHls();
    hlsInstance.currentLevel = level;
  };

  const checkMediaHasDataToPlay = () => {
    const media = getMedia();
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

  const onSeeking = () => {
    const media = getMedia();
    updateCurrentTime(media.currentTime);
    if (!checkMediaHasDataToPlay()) {
      updateIsLoading(true);
    }
  };

  const onLoadedMetadata = () => updateDuration(getMedia().duration);

  const onRateChange = () => updatePlaybackRate(getMedia().playbackRate);

  const onVolumeChange = () => {
    const media = getMedia();
    updateMuted(media.muted);
    updateVolume(media.volume);
  };

  const onPause = () => updatePaused(true);

  const onPlay = () => {
    updatePaused(false);
    updateEnded(false);
  };

  const onCanPlay = () => updateIsLoading(false);

  const onEmptied = () => updateIsLoading(true);

  const onWaiting = () => {
    if (!checkMediaHasDataToPlay()) {
      updateIsLoading(true);
    }
  };

  const onTimeUpdate = () => updateCurrentTime(getMedia().currentTime);

  const onEnded = () => updateEnded(true);

  const setCurrentTime = (newCurrentTime: number) =>
    (getMedia().currentTime = Math.min(
      Math.max(newCurrentTime, 0),
      getMedia().duration
    ));

  const setPlaybackRate = (newPlaybackRate: number) => {
    getMedia().playbackRate = newPlaybackRate;
  };

  const setVolume = (newVolume: number) => (getMedia().volume = newVolume);

  const toggleMuted = () => (getMedia().muted = !getMedia().muted);

  const togglePlay = async () => {
    const media = getMedia();
    if (media.paused) {
      (playPromiseRef.current as any) = media.play();
    } else {
      if (playPromiseRef.current) {
        await playPromiseRef.current;
        media.pause();
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
        getMedia,

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

        // Media methods
        setCurrentTime,
        setPlaybackRate,
        setVolume,
        toggleMuted,
        togglePlay,

        mediaEventHandlers: {
          onSeeking,
          onLoadedMetadata,
          onRateChange,
          onVolumeChange,
          onCanPlay,
          onWaiting,
          onPause,
          onPlay,
          onTimeUpdate,
          onEmptied,
          onEnded,
        },
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};
