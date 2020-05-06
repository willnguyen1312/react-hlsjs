import React, { useEffect, useRef, useState, FC } from 'react';
import Hls from 'hls.js';
import { MediaContext, Resolutions } from './MediaContext';

interface MediaProviderProps {
  mediaSource: string;
}

export const MediaProvider: FC<MediaProviderProps> = ({
  children,
  mediaSource,
}) => {
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const hlsRef = useRef<Hls>(null);
  const [resolutions, setResolutions] = useState<Resolutions>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ended, setEnded] = useState(false);
  const [paused, setPaused] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
        const levels = (data.levels as unknown) as Hls.Level[];
        const newResolutions = levels.map(level => level.height);
        setResolutions(newResolutions);
      });

      (hlsRef.current as any) = newHls;
      (window as any).hls = newHls;
    } else if (media && media.canPlayType('application/vnd.apple.mpegurl')) {
      // For native support like Apple
      media.src = mediaSource;
    }

    return releaseHlsResource;
  }, [mediaSource]);

  const setResolution = (resolutionIndex: number) => {
    const hlsInstance = getHls();
    hlsInstance.currentLevel = resolutionIndex;
  };

  const checkMediaHasDataToPlay = (time: number) => {
    const media = getMedia();
    const timeRanges = Array.from(
      { length: media.buffered.length },
      (_, index) => {
        return [media.buffered.start(index), media.buffered.end(index)];
      }
    );

    return timeRanges.some(timeRange => {
      const [start, end] = timeRange;
      return time >= start && time <= end;
    });
  };

  const onSeeking = () => {
    const media = getMedia();
    setCurrentTime(media.currentTime);
    if (!checkMediaHasDataToPlay(media.currentTime)) {
      setIsLoading(true);
    }
  };

  const onLoadedMetadata = () => {
    const media = getMedia();
    setDuration(media.duration);
    media.play();
  };

  const onRateChange = () => setPlaybackRate(getMedia().playbackRate);

  const onVolumeChange = () => {
    const media = getMedia();
    setMuted(media.muted);
    setVolume(media.volume);
  };

  const onPause = () => setPaused(true);

  const onPlay = () => {
    setPaused(false);
    setEnded(false);
  };

  const onCanPlay = () => setIsLoading(false);

  const onEmptied = () => setIsLoading(true);

  const onWaiting = () => setIsLoading(true);

  const onTimeUpdate = () => setCurrentTime(getMedia().currentTime);

  const onEnded = () => setEnded(true);

  return (
    <MediaContext.Provider
      value={{
        mediaRef,
        getMedia,

        // Streaming properties
        resolutions,
        setResolution,

        // Media properties
        currentTime,
        duration,
        isLoading,
        paused,
        playbackRate,
        volume,
        ended,
        muted,

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
