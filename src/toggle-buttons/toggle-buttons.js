import React, {useState} from 'react';
import './toggle-button.scss';

export default ({buttons}) => {
  const [selected, setSelected] = useState(0);
  return (
    <div className="toggle-buttons">
      {buttons.map((btn, index) => (
        <button
          className={index === selected ? 'selected' : ''}
          key={'b' + index}
          onClick={() => setSelected(index)}
        >
          {btn.text}
        </button>
      ))}
    </div>
  );
};
