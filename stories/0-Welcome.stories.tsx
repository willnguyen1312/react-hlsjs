import React from 'react';
import { Audio } from '..';

export default {
  title: 'Welcome',
};

export const toStorybook = () => <Audio />;

toStorybook.story = {
  name: 'to Storybook',
};
