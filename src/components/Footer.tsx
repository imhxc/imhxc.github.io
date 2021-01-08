import React from 'react';

import { rhythm } from '../utils/typography';
import config from '../../config';

const { github, email, about } = config;
class Footer extends React.Component {
  render() {
    return (
      <footer
        style={{
          marginTop: rhythm(2.5),
          paddingTop: rhythm(1),
        }}
      >
        <a href={github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        {' '}&bull;{' '}
        <a href={about} rel="noopener noreferrer">
          About
        </a>
        {' '}&bull;{' '}
        <a href={`mailto:${email}`} rel="noopener noreferrer">
          Email
        </a>
      </footer>
    );
  }
}

export default Footer;
