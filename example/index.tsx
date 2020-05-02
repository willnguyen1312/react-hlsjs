import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Audio, Video, MediaProvider } from '../.';

const videoSrc1 = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
const videoSrc2 =
  'https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8';
const videoSrc3 =
  'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8';
const videoSrc4 =
  'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8';

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
    setAudioSource(audioSource === audioSrc1 ? audioSrc2 : audioSrc1);
  };

  console.log(videoSource === videoSrc3);

  return (
    <div>
      {/* <button onClick={toggleAudioSource}>Toggle Audio Source</button>
      <MediaProvider mediaSource={audioSource}>
        <Audio />
      </MediaProvider> */}

      <hr />

      <div style={{ display: 'flex' }}>
        <button
          style={{
            borderColor: (videoSource === videoSrc1 && 'red') || '',
            cursor: 'pointer',
            marginRight: 5,
          }}
          onClick={() => setVideoSource(videoSrc1)}
        >
          videoSrc1
        </button>
        <button
          style={{
            borderColor: (videoSource === videoSrc2 && 'red') || '',
            cursor: 'pointer',
            marginRight: 5,
          }}
          onClick={() => setVideoSource(videoSrc2)}
        >
          videoSrc2
        </button>
        <button
          style={{
            borderColor: (videoSource === videoSrc3 && 'red') || '',
            cursor: 'pointer',
            marginRight: 5,
          }}
          onClick={() => setVideoSource(videoSrc3)}
        >
          videoSrc3
        </button>
        <button
          style={{
            borderColor: (videoSource === videoSrc4 && 'red') || '',
            cursor: 'pointer',
            marginRight: 5,
          }}
          onClick={() => setVideoSource(videoSrc4)}
        >
          videoSrc4
        </button>
      </div>
      <MediaProvider mediaSource={videoSource}>
        <Video />
      </MediaProvider>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
