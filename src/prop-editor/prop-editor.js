import {EasyContext} from 'context-easy';
import React, {useContext} from 'react';
import './prop-editor.scss';

function configRow(context, component, key, props) {
  const {defaultValue, type} = props;
  let value = component[key];
  if (value === undefined) value = defaultValue;

  const handleChange = async event => {
    const path = `propsMap.${component.componentId}.${key}`;
    const v = getEventValue(type, event);
    await context.set(path, v);
  };

  let input;
  switch (type) {
    case 'boolean':
      input = <input type="checkbox" onChange={handleChange} checked={value} />;
      break;
    case 'color':
      // type="color" is not supported in IE or iOS Safari!
      input = <input type="color" onChange={handleChange} value={value} />;
      break;
    case 'fontFamily':
      input = (
        <select onChange={handleChange} value={value}>
          <option>monospace</option>
          <option>sans-serif</option>
          <option>serif</option>
        </select>
      );
      break;
    case 'fontSize':
      input = <input type="number" onChange={handleChange} value={value} />;
      break;
    case 'multipleChoice':
      const {options} = props;
      input = (
        <select onChange={handleChange} value={value}>
          {options.map((option, index) => {
            const {label, value} = option;
            return (
              <option key={'opt' + index} value={value || label}>
                {label}
              </option>
            );
          })}
        </select>
      );
      break;
    case 'number':
      input = <input type="number" onChange={handleChange} value={value} />;
      break;
    case 'text':
      input = <input type="text" onChange={handleChange} value={value} />;
      break;
    default:
  }

  return (
    <div className="row" key={key}>
      <label>{key}</label>
      {input}
    </div>
  );
}

function getEventValue(type, event) {
  const {checked, value} = event.target;
  return type === 'boolean'
    ? checked
    : type === 'number' || type === 'fontSize'
    ? Number(value)
    : value;
}

export default ({config}) => {
  const context = useContext(EasyContext);
  const {propsMap, selectedComponentId} = context;

  const selectedComponent = propsMap[selectedComponentId];

  const keys = Object.keys(config).sort();
  if (keys.length === 0) return null;

  return (
    <div className="prop-editor">
      {keys.map(key => configRow(context, selectedComponent, key, config[key]))}
    </div>
  );
};
