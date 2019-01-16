import {EasyContext} from 'context-easy';
import {arrayOf, shape, string} from 'prop-types';
import React, {useContext} from 'react';
import './toggle-button.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

function ToggleButtons({buttons, path}) {
  const context = useContext(EasyContext);
  return (
    <div className="toggle-buttons">
      {buttons.map((button, index) => {
        const {icon, label, title, value} = button;
        const v = value || label;
        return (
          <button
            className={v === context.get(path) ? 'selected' : ''}
            key={'b' + index}
            onClick={() => context.set(path, v)}
          >
            {label}
            {icon ? <FontAwesomeIcon icon={icon} title={title} /> : null}
          </button>
        );
      })}
    </div>
  );
}

ToggleButtons.propTypes = {
  buttons: arrayOf(
    shape({icon: string, label: string, title: string, value: string})
  ).isRequired,
  path: string.isRequired
};

export default ToggleButtons;
