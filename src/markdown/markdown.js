import {EasyContext} from 'context-easy';
import marked from 'marked';
import {string} from 'prop-types';
import React, {useContext} from 'react';

import {register} from '../library';
import {getStyles} from '../styles';

import './markdown.scss';

const config = {
  backgroundColor: {
    type: 'color',
    defaultValue: '#FFFFFF'
  },
  color: {
    type: 'color',
    defaultValue: '#000000'
  },
  fontFamily: {
    type: 'fontFamily',
    defaultValue: 'sans-serif'
  },
  fontSize: {
    type: 'fontSize',
    defaultValue: 18
  },
  markdown: {
    type: 'textarea',
    defaultValue: ''
  }
};

function Markdown(props) {
  const {markdown} = props;
  const context = useContext(EasyContext);

  // Replace placeholders in markdown with context values.
  const re = /\$\{([^}]+)\}/;
  const parts = markdown
    .split(re)
    .map((part, index) => (index % 2 === 0 ? part : context.get(part)));
  const text = parts.join('');

  return (
    <div
      className="markdown"
      dangerouslySetInnerHTML={{__html: marked(text)}}
      style={getStyles(props)}
    />
  );
}

Markdown.propTypes = {
  markdown: string.isRequired
};

register(Markdown, config, 4, 2);
