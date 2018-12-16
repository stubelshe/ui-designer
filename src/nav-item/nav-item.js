// These allow using an a tag with no href
// and using onClick without onKeyPress.
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import {EasyContext} from 'context-easy';
import {string} from 'prop-types';
import React, {useContext} from 'react';
import {register} from '../library';

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
  kind: {
    type: 'multipleChoice',
    options: kinds.map(kind => ({label: kind})),
    defaultValue: kinds[0]
  },
  page: {
    type: 'page'
  },
  text: {
    type: 'text',
    defaultValue: 'replace'
  }
};

function NavItem(props) {
  const {kind, page, text} = props;
  const context = useContext(EasyContext);
  const navigate = () => context.set('page', page);
  return kind === 'button' ? (
    <button onClick={navigate} style={props}>
      {text}
    </button>
  ) : (
    <a onClick={navigate}>{text}</a>
  );
}

NavItem.propTypes = {
  kind: string,
  page: string,
  text: string
};

register(NavItem, config);
