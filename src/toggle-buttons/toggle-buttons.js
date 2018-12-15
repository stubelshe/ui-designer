import {EasyContext} from 'context-easy';
import React, {useContext} from 'react';
import './toggle-button.scss';

export default ({buttons, path}) => {
  const context = useContext(EasyContext);
  return (
    <div className="toggle-buttons">
      {buttons.map((button, index) => (
        <button
          className={button === context[path] ? 'selected' : ''}
          key={'b' + index}
          onClick={() => context.set(path, button)}
        >
          {button}
        </button>
      ))}
    </div>
  );
};
