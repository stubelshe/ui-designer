import {EasyContext} from 'context-easy';
import {string} from 'prop-types';
import React, {useContext} from 'react';

import {register} from '../library';
import {getStyles} from '../styles';

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
  height: {
    type: 'number',
    defaultValue: 100
  },
  markup: {
    type: 'text'
  },
  width: {
    type: 'number',
    defaultValue: 200
  }
};

function Markup(props) {
  const {markup} = props;
  const context = useContext(EasyContext);

  // Replace placeholders in markup with context values.
  const re = /\$\{([^}]+)\}/;
  const parts = markup
    .split(re)
    .map((part, index) => (index % 2 === 0 ? part : context.get(part)));
  const text = parts.join('');

  return <p style={getStyles(props)}>{text}</p>;
}

Markup.propTypes = {
  markup: string
};

register(Markup, config);
