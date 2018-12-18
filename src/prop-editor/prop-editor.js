/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import {EasyContext, RadioButtons} from 'context-easy';
import {object} from 'prop-types';
import React, {useContext} from 'react';
import './prop-editor.scss';

const scopeButtonList = [
  {text: 'Class', value: 'class'},
  {text: 'Instance', value: 'instance'}
];

function configRow(context, component, key, properties) {
  const {propScope} = context;
  const {defaultValue, type} = properties;

  function getClassValue() {
    const path = `classPropsMap.${component.componentName}.${key}`;
    return context.get(path);
  }

  let value;
  if (propScope === 'instance') {
    value = component[key];
    if (value === undefined) value = getClassValue();
  } else {
    value = getClassValue();
  }
  if (value === undefined) value = defaultValue;

  const handleChange = async event => {
    const id =
      propScope === 'class' ? component.componentName : component.componentId;
    const path = `${propScope}PropsMap.${id}.${key}`;
    await context.set(path, getEventValue(type, event));
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
      const {pages, selectedPage} = context;
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
  const {instancePropsMap, selectedComponentId} = context;
  const selectedComponent = instancePropsMap[selectedComponentId];

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
