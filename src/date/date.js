import React from 'react';
import './date.scss';

export const config = {
  backgroundColor: {
    type: 'color',
    defaultValue: 'white'
  },
  color: {
    type: 'color',
    defaultValue: 'black'
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
    type: 'string', //TODO: multiple-choice?
    defaultValue: 'mm/dd/yyyy'
  }
};

export default props => {
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();

  return (
    <div className="date" style={props}>
      {month}/{day}/{year}
    </div>
  );
};
