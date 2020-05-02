import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Audio, Video, MediaProvider } from '../.';

const videoSrc1 = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
const videoSrc2 =
  'https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8';
const audioSrc1 =
  'https://pl.streamingvideoprovider.com/mp3-playlist/playlist.m3u8';

const audioSrc2 =
  'https://s3.amazonaws.com/qa.jwplayer.com/~alex/121628/new_master.m3u8';

const App = () => {
  const [videoSource, setVideoSource] = React.useState(videoSrc1);
  const [audioSource, setAudioSource] = React.useState(audioSrc1);

  const toggleVideoSource = () => {
    setVideoSource(videoSource === videoSrc1 ? videoSrc2 : videoSrc1);
  };

  const toggleAudioSource = () => {
    setAudioSource(videoSource === videoSrc1 ? videoSrc2 : videoSrc1);
  };

  return (
    <div>
      <button onClick={toggleAudioSource}>Toggle Audio Source</button>
      <MediaProvider mediaSource={audioSource}>
        <Audio />
      </MediaProvider>

      <hr />

      <button onClick={toggleVideoSource}>Toggle Video Source</button>
      <MediaProvider mediaSource={videoSource}>
        <Video />
      </MediaProvider>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
