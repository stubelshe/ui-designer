/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import {EasyContext, RadioButtons} from 'context-easy';
import {object} from 'prop-types';
import React, {useContext} from 'react';
import './prop-editor.scss';

const scopeButtonList = [{text: 'Class'}, {text: 'Instance'}];

function configRow(context, component, key, properties) {
  const {defaultValue, type} = properties;
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
        <select onBlur={handleChange} onChange={handleChange} value={value}>
          <option>monospace</option>
          <option>sans-serif</option>
          <option>serif</option>
        </select>
      );
      break;
    case 'fontSize':
      input = <input type="number" onChange={handleChange} value={value} />;
      break;
    case 'multipleChoice': {
      const {options} = properties;
      input = (
        <select onBlur={handleChange} onChange={handleChange} value={value}>
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
    }
    case 'number':
      input = <input type="number" onChange={handleChange} value={value} />;
      break;
    case 'page': {
      const pages = context.get('pages');
      const selectedPage = context.get('selectedPage');
      const pageNames = Object.keys(pages)
        .filter(page => page !== selectedPage)
        .sort();
      input = (
        <select onBlur={handleChange} onChange={handleChange} value={value}>
          <option key="opt0" />
          {pageNames.map((pageName, index) => (
            <option key={'opt' + (index + 1)} value={pageName}>
              {pageName}
            </option>
          ))}
        </select>
      );
      break;
    }
    case 'text':
      input = <input type="text" onChange={handleChange} value={value} />;
      break;
    default:
  }

  return (
    <div className="row" key={key}>
      <label>
        {formatKey(key)}
        {input}
      </label>
    </div>
  );
}

function formatKey(key) {
  const [first] = key;
  let rest = key.substring(1);
  rest = rest.replace(/([A-Z])/g, ' $1');
  rest = rest.replace(/(\d+)/g, ' $1');
  return first.toUpperCase() + rest;
}

function getEventValue(type, event) {
  const {checked, value} = event.target;
  return type === 'boolean'
    ? checked
    : type === 'number' || type === 'fontSize'
    ? Number(value)
    : value;
}

function PropEditor({config}) {
  const context = useContext(EasyContext);
  const {propsMap, selectedComponentId} = context;
  const selectedComponent = propsMap[selectedComponentId];

  const keys = Object.keys(config).sort();
  if (keys.length === 0) return null;

  return (
    <div className="prop-editor">
      <div className="prop-scope-row">
        <label>
          Scope
          <RadioButtons
            className="prop-scope"
            list={scopeButtonList}
            path="propScope"
          />
        </label>
      </div>
      {keys.map(key => configRow(context, selectedComponent, key, config[key]))}
    </div>
  );
}

PropEditor.propTypes = {
  config: object
};

export default PropEditor;
