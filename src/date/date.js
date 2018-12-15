import {format} from 'date-fns';
import React from 'react';
import './date.scss';

const formats = ['MMMM D, YYYY', 'MMM D, YYYY', 'M/D/YYYY'];

export const config = {
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

export default props => {
  // Non-style props are ignored by the style attribute.
  return (
    <div className="date" style={props}>
      {format(new Date(), props.format)}
    </div>
  );
};
