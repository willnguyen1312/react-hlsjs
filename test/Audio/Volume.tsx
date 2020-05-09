import React from 'react';
import { useMediaContext } from '../../src';

export const Volume = () => {
  const { toggleMuted } = useMediaContext();
  return <button onClick={toggleMuted}>Toggle Muted</button>;
};
