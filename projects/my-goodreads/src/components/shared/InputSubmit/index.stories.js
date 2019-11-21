import React from 'react';
import InputSubmit from './index';

export default { title: 'InputSubmit' };

export const withText = () => <InputSubmit>Hello Button</InputSubmit>;

export const withEmoji = () => (
  <InputSubmit><span role="img" aria-label="so cool">😀 😎 👍 💯</span></InputSubmit>
);
