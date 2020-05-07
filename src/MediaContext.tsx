import React, { useContext } from 'react';
import { Func } from './utils';

export interface MediaProps {
  onSeeking?: Func;
  onLoadedMetadata?: Func;
  onRateChange?: Func;
  onVolumeChange?: Func;
  onCanPlay?: Func;
  onWaiting?: Func;
  onPause?: Func;
  onPlay?: Func;
  onTimeUpdate?: Func;
  onEmptied?: Func;
  onEnded?: Func;
}

interface MediaContextType extends MediaContextProps {
  // Ref to attach on media
  mediaRef: React.RefObject<HTMLVideoElement | HTMLAudioElement>;

  // Event Handler
  _onSeeking: () => void;
  _onLoadedMetadata: () => void;
  _onRateChange: () => void;
  _onVolumeChange: () => void;
  _onCanPlay: () => void;
  _onWaiting: () => void;
  _onPause: () => void;
  _onPlay: () => void;
  _onTimeUpdate: () => void;
  _onEmptied: () => void;
  _onEnded: () => void;
}

export const MediaContext = React.createContext<MediaContextType | null>(null);

export interface MediaContextProps {
  // Prop Getter for media
  getMedia: () => HTMLVideoElement | HTMLAudioElement;

  // Streaming properties
  levels: Hls.Level[];
  setLevel: (level?: number) => void;

  // Media Properties
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  paused: boolean;
  muted: boolean;
  ended: boolean;
  isLoading: boolean;

  // Media control methods
  setCurrentTime: (newCurrentTime: number) => void;
  setPlaybackRate: (newPlaybackRate: number) => void;
  setVolume: (newVolume: number) => void;
  togglePlay: () => void;
  toggleMuted: () => void;
}

export const _useMediaContext = () => {
  const mediaContext = useContext(MediaContext);

  if (!mediaContext) {
    throw new Error('Please place inside MediaContext');
  }

  return mediaContext;
};

export const useMediaContext = () => {
  const mediaContext = useContext(MediaContext);

  if (!mediaContext) {
    throw new Error('Please place inside MediaContext');
  }

  return {
    currentTime: mediaContext.currentTime,
    duration: mediaContext.duration,
    ended: mediaContext.ended,
    isLoading: mediaContext.isLoading,
    levels: mediaContext.levels,
    muted: mediaContext.muted,
    getMedia: mediaContext.getMedia,
    paused: mediaContext.paused,
    volume: mediaContext.volume,
    togglePlay: mediaContext.togglePlay,
    toggleMuted: mediaContext.toggleMuted,
    setCurrentTime: mediaContext.setCurrentTime,
    setLevel: mediaContext.setLevel,
    setPlaybackRate: mediaContext.setPlaybackRate,
    setVolume: mediaContext.setVolume,
    playbackRate: mediaContext.playbackRate,
  };
};

export const withMediaContext = <P extends { mediaContext: MediaContextProps }>(
  Component: React.ComponentType<P>
) => (props: Omit<P, 'mediaContext'>) => {
  const mediaContext = useMediaContext();
  return <Component {...(props as P)} mediaContext={mediaContext} />;
};

interface HelloProps {
  a: number;
  mediaContext: MediaContextProps;
}

const Hello: React.FC<HelloProps> = ({ a }) => <h1>Hi</h1>;

const Aha = withMediaContext(Hello);

const Use = () => <Aha a={3} />;

interface MediaContextConsumerProps {
  children?: (mediaContext: MediaContextProps) => React.ReactNode;
  render?: (mediaContext: MediaContextProps) => React.ReactNode;
}

export const MediaConsumer: React.FC<MediaContextConsumerProps> = ({
  children,
  render,
}) => {
  const mediaContext = useMediaContext();

  const _render = render || children;
  if (!_render) {
    throw new Error('Please provide either children or render prop');
  }

  return <>{_render(mediaContext)}</>;
};

const LET = () => (
  <MediaConsumer>
    {({ currentTime }) => {
      return currentTime;
    }}
  </MediaConsumer>
);

const LET2 = () => (
  <MediaConsumer
    render={({ currentTime }) => {
      return currentTime;
    }}
  />
);
