import {EasyContext} from 'context-easy';
import React, {useContext} from 'react';
import './prop-editor.scss';

function configRow(context, component, key, props) {
  const {default: defaultValue, type} = props;
  const value = component[key] || defaultValue;

  function handleChange(e) {
    const {checked, value} = e.target;
    const v =
      type === 'boolean'
        ? checked
        : type === 'number' || type === 'fontSize'
        ? Number(value)
        : value;
    const path = `propsMap.${component.componentId}.${key}`;
    console.log('prop-editor.js handleChange: path =', path);
    console.log('prop-editor.js handleChange: v =', v);
    context.set(path, v);
  }

  let input;
  switch (type) {
    case 'boolean':
      input = <input type="checkbox" onChange={handleChange} checked={value} />;
      break;
    case 'color':
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
