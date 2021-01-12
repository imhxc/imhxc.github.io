import React from 'react';

import { rhythm } from '../utils/typography';
import config from '../../config';

const { githubUrl, juejin } = config;
class Footer extends React.Component {
  render() {
    return (
      <footer
        style={{
          marginTop: rhythm(2.5),
          paddingTop: rhythm(1),
        }}
      >
        <a href={githubUrl} target="_blank" rel="noopener noreferrer">
          github
        </a>{' '}
        {juejin && (
          <>
            &bull;{' '}
            <a href={juejin} target="_blank" rel="noopener noreferrer">
              掘金
            </a>
          </>
        )}
        &bull;{' '}
        <a href="mailto:505421473@qq.com">
          Email
        </a>
      </footer>
    );
  }
}

export default Footer;
