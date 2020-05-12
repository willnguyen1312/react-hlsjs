import React from 'react';

import { render, fireEvent, waitForElement } from '@testing-library/react';
import { MediaProvider, MediaConsumer, Video } from '../../src';
import { getElement } from '../utils';

describe('video', () => {
  it('should work', async () => {
    const mocknVolumeChange = jest.fn();
    const { getByText, container, debug } = render(
      <MediaProvider mediaSource={''}>
        <MediaConsumer
          render={({ getMediaStat }) => (
            <Video onVolumeChange={mocknVolumeChange} />
          )}
        />
      </MediaProvider>
    );

    const videoElement = getElement(container, 'video');

    const muteButton = getByText(/Toggle muted/i);

    fireEvent.click(muteButton);

    getByText(/Muted: true/i);
    expect(mocknVolumeChange).toHaveBeenCalledTimes(1);
  });
});
