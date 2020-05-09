import React from 'react';
import { Video, MediaProvider, MediaConsumer } from '../src';

export default {
  title: 'Welcome',
};

const videoSource = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

const BasicVideo = (
  <MediaProvider mediaSource={videoSource}>
    <MediaConsumer render={() => <Video />} />
  </MediaProvider>
);

export const toStorybook = () => BasicVideo;

toStorybook.story = {
  name: 'to Storybook',
};
