// These allow using an a tag with no href
// and using onClick without onKeyPress.
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import {EasyContext} from 'context-easy';
import {string} from 'prop-types';
import React, {useContext} from 'react';
import {register} from '../library';
import {getStyles} from '../styles';

const kinds = ['button', 'link'];

const config = {
  backgroundColor: {
    type: 'color',
    defaultValue: '#FFFFFF'
  },
  color: {
    type: 'color',
    defaultValue: '#0000FF'
  },
  fontFamily: {
    type: 'fontFamily',
    defaultValue: 'sans-serif'
  },
  fontSize: {
    type: 'fontSize',
    defaultValue: 18
  },
  goToPage: {
    type: 'page',
    defaultValue: ''
  },
  kind: {
    type: 'multipleChoice',
    options: kinds.map(kind => ({label: kind})),
    defaultValue: kinds[0]
  },
  text: {
    type: 'text',
    defaultValue: 'replace'
  }
};

function NavItem(props) {
  const {goToPage, kind, text} = props;
  const context = useContext(EasyContext);
  const navigate = () => {
    if (context.mode === 'Demo') context.set('selectedPage', goToPage);
  };

  const styles = getStyles(props);
  if (kind === 'link') styles.backgroundColor = 'transparent';

  return kind === 'button' ? (
    <button onClick={navigate} style={styles}>
      {text}
    </button>
  ) : (
    <a href="#" onClick={navigate} style={styles}>
      {text}
    </a>
  );
}

NavItem.propTypes = {
  goToPage: string.isRequired,
  kind: string.isRequired,
  text: string.isRequired
};

register(NavItem, config, 2, 1);
