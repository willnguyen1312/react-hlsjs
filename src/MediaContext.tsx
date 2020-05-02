import React, { useContext } from 'react';

interface MediaContextType {
  // Ref to attach on media
  mediaRef: React.RefObject<HTMLVideoElement | HTMLAudioElement>;
  // Prop Getter for media
  getMedia: () => HTMLVideoElement | HTMLAudioElement;

  // Video Properties
  currentTime: number;
  volume: number;
  playbackRate: number;
  paused: boolean;
  duration: number;
  isLoading: boolean;

  // Event Handler
  onSeeking: () => void;
  onSeeked: () => void;
  onLoadedMetadata: () => void;
  onRateChange: () => void;
  onVolumeChange: () => void;
  onCanPlay: () => void;
  onWaiting: () => void;
  onPause: () => void;
  onPlay: () => void;
  onTimeUpdate: () => void;
}

export const MediaContext = React.createContext<MediaContextType | null>(null);

export const useMediaContext = () => {
  const mediaContext = useContext(MediaContext);

  if (!mediaContext) {
    throw new Error('Please place inside MediaContext');
  }

  return mediaContext;
};
