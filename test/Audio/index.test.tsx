import '@testing-library/jest-dom';

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MediaProvider, MediaConsumer, Audio } from '../../src';
import { Volume } from './Volume';
import { getElement } from '../utils';

const audioSrc1 =
  'https://pl.streamingvideoprovider.com/mp3-playlist/playlist.m3u8';

it('should pass', () => {
  const comp = (
    <MediaProvider mediaSource={audioSrc1}>
      <MediaConsumer>
        {({ getMediaStat }) => {
          return (
            <Audio
              onPause={() =>
                console.log(`Paused at: ${getMediaStat().currentTime}`)
              }
            />
          );
        }}
      </MediaConsumer>

      <Volume />
    </MediaProvider>
  );

  const { container, getByText } = render(comp);
  const toggleMutedBtn = getByText(/Toggle Muted/i);
  const audioElement = getElement(container, 'audio');

  expect(audioElement.muted).toBe(false);

  fireEvent.click(toggleMutedBtn);
  expect(audioElement.muted).toBe(true);
});
