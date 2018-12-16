import {format} from 'date-fns';
import {string} from 'prop-types';
import React from 'react';
import {register} from '../library';
import {getStyles} from '../styles';
import './date-display.scss';

const formats = ['MMMM D, YYYY', 'MMM D, YYYY', 'M/D/YYYY'];

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
    type: 'string', //TODO: multiple-choice?
    defaultValue: 'sans-serif'
  },
  fontSize: {
    type: 'number',
    defaultValue: 18
  },
  format: {
    type: 'multipleChoice',
    options: formats.map(format => ({label: format})),
    defaultValue: formats[0]
  }
};

function DateDisplay(props) {
  // Non-style props are ignored by the style attribute.
  return (
    <div className="date-display" style={getStyles(props)}>
      {format(new Date(), props.format)}
    </div>
  );
}

DateDisplay.propTypes = {
  format: string
};

register(DateDisplay, config);
