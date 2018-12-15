import React from 'react';

export const config = {
  backgroundColor: {
    type: 'color',
    default: 'white'
  },
  color: {
    type: 'color',
    default: 'black'
  },
  fontFamily: {
    type: 'string', //TODO: multiple-choice?
    default: 'sans-serif'
  },
  fontSize: {
    type: 'number',
    default: 18
  },
  format: {
    type: 'string', //TODO: multiple-choice?
    default: 'mm/dd/yyyy'
  }
};

export default () => {
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();

  return (
    <div className="date">
      <span>
        {month}/{day}/{year}
      </span>
    </div>
  );
};
