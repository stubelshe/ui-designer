import {EasyContext} from 'context-easy';
import {arrayOf, string} from 'prop-types';
import React, {useContext} from 'react';
import './toggle-button.scss';

function ToggleButtons({buttons, path}) {
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
}

ToggleButtons.propTypes = {
  buttons: arrayOf(string),
  path: string
};

export default ToggleButtons;
