import React from 'react';

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
