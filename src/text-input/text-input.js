/* eslint-disable jsx-a11y/label-has-for */
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
  label: {
    type: 'text'
  },
  path: {
    type: 'text',
    defaultValue: ''
  }
};

function TextInput(props) {
  const {label, path} = props;
  const input = <Input path={path} style={getStyles(props)} />;
  return (
    <div className="text-input">
      {label ? (
        <label>
          {label} {input}
        </label>
      ) : (
        input
      )}
    </div>
  );
}

TextInput.propTypes = {
  label: string,
  path: string.isRequired
};

register(TextInput, config, 3, 1);
