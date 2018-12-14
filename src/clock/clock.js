import React, {useEffect, useState} from 'react';

function padNumber(n) {
  return n.toString().padStart(2, '0');
}

export default () => {
  const [, refresh] = useState();

  useEffect(() => {
    const token = setInterval(refresh, 1000);
    return () => clearInterval(token);
  }, []);

  const date = new Date();
  const hours = date.getHours();
  const amPm = hours >= 12 ? 'PM' : 'AM';
  const minutes = padNumber(date.getMinutes());
  const seconds = padNumber(date.getSeconds());

  return (
    <div className="clock">
      <span>
        {hours % 12}:{minutes}:{seconds} {amPm}
      </span>
    </div>
  );
};
