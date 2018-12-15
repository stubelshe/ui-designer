import {EasyContext, Select} from 'context-easy';
import React, {useContext} from 'react';

import Clock, {config as clockConfig} from '../clock/clock';
import Date, {config as dateConfig} from '../date/date';
import PropEditor from '../prop-editor/prop-editor';
import ToggleButtons from '../toggle-buttons/toggle-buttons';

import './ui-designer.scss';

const buttons = [{text: 'Edit'}, {text: 'Test'}];

const configMap = {
  Clock: clockConfig,
  Date: dateConfig
};

function getComponent(props) {
  switch (props.componentName) {
    case 'Clock':
      return <Clock {...props} />;
    case 'Date':
      return <Date {...props} />;
    default:
  }
}

export default () => {
  const context = useContext(EasyContext);
  const {
    nextComponentId,
    propsMap,
    selectedComponentName,
    selectedComponentId
  } = context;

  const selectedComponent = propsMap[selectedComponentId];
  const config = selectedComponent
    ? configMap[selectedComponent.componentName]
    : {};

  const addComponent = async () => {
    const componentId = nextComponentId;
    await context.increment('nextComponentId');
    const props = {
      componentId,
      componentName: selectedComponentName
    };
    const newPropsMap = {...propsMap, [componentId]: props};
    context.set('propsMap', newPropsMap);
  };

  const getComponents = propsMap => {
    const componentIds = Object.keys(propsMap);
    return componentIds.map(componentId => {
      const props = propsMap[componentId];
      const component = getComponent(props);
      if (!component) return null;
      const className = 'container' + (props.selected ? ' selected' : '');
      return (
        <div
          className={className}
          key={'c' + componentId}
          onClick={() => toggleSelected(componentId)}
        >
          {component}
        </div>
      );
    });
  };

  const toggleSelected = async componentId => {
    const properties = propsMap[componentId];
    const selected = !properties.selected;
    const newPropsMap = {
      ...propsMap,
      [componentId]: {...properties, selected}
    };
    await context.set('selectedComponentId', selected ? componentId : 0);
    context.set('propsMap', newPropsMap);
  };

  return (
    <div className="ui-designer">
      <header>
        <h2>UI Designer</h2>
        <div>
          <label>Mode</label>
          <ToggleButtons buttons={buttons} />
        </div>
      </header>
      <section className="component-select">
        <Select path="selectedComponentName">
          <option value="" />
          <option value="Clock">Clock</option>
          <option value="Date">Date</option>
        </Select>
        <button disabled={!selectedComponentName} onClick={addComponent}>
          Add
        </button>
      </section>
      <section className="main">
        <section className="component-display">
          {getComponents(propsMap)}
        </section>
        {selectedComponentId ? <PropEditor config={config} /> : null}
      </section>
      <footer />
    </div>
  );
};
