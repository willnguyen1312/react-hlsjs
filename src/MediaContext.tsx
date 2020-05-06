import React, { useContext } from 'react';

interface MediaContextType extends MediaContextProps {
  // Ref to attach on media
  mediaRef: React.RefObject<HTMLVideoElement | HTMLAudioElement>;

  // Event Handler
  mediaEventHandlers: {
    onSeeking: () => void;
    onLoadedMetadata: () => void;
    onRateChange: () => void;
    onVolumeChange: () => void;
    onCanPlay: () => void;
    onWaiting: () => void;
    onPause: () => void;
    onPlay: () => void;
    onTimeUpdate: () => void;
    onEmptied: () => void;
    onEnded: () => void;
  };
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

  const { mediaEventHandlers, mediaRef, ...rest } = mediaContext;

  return rest;
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

export const MediaContextConsumer: React.FC<MediaContextConsumerProps> = ({
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
  <MediaContextConsumer>
    {({ currentTime }) => {
      return currentTime;
    }}
  </MediaContextConsumer>
);

const LET2 = () => (
  <MediaContextConsumer
    render={({ currentTime }) => {
      return currentTime;
    }}
  />
);
