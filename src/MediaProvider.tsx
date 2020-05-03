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
  let hls: Hls | null = null;
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const [paused, setPaused] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);

  const getMedia = () => {
    const media = mediaRef.current;
    if (!media) {
      throw new Error('media element is not available');
    }
    return media;
  };

  const releaseHlsResource = () => {
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
      hls = newHls;
      (window as any).hls = hls;
    } else if (media && media.canPlayType('application/vnd.apple.mpegurl')) {
      // For native support like Apple
      media.src = mediaSource;
    }

    return releaseHlsResource;
  }, [mediaSource]);

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

  const onVolumeChange = () => setVolume(getMedia().volume);

  const onPause = () => setPaused(true);

  const onPlay = () => setPaused(false);

  const onCanPlay = () => setIsLoading(false);

  const onEmptied = () => setIsLoading(true);

  const onWaiting = () => setIsLoading(true);

  const onTimeUpdate = () => setCurrentTime(getMedia().currentTime);

  return (
    <MediaContext.Provider
      value={{
        mediaRef,
        getMedia,
        currentTime,
        duration,
        isLoading,
        paused,
        playbackRate,
        volume,

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
        },
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};
