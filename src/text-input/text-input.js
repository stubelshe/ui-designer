import {Input} from 'context-easy';
import {string} from 'prop-types';
import React from 'react';
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
  path: {
    type: 'text'
  }
};

function TextInput(props) {
  const {path} = props;
  return <Input path={path} style={getStyles(props)} />;
}

TextInput.propTypes = {
  path: string
};

register(TextInput, config);
