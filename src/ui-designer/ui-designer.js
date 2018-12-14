import {EasyContext, Select} from 'context-easy';
import React, {useContext} from 'react';

import Clock from '../clock/clock';
import Date from '../date/date';
import ToggleButtons from '../toggle-buttons/toggle-buttons';

import './ui-designer.scss';

const buttons = [{text: 'Edit'}, {text: 'Test'}];

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
  const {nextComponentId, propsMap, selectedComponent} = context;
  console.log('ui-designer.js: propsMap =', propsMap);

  const addComponent = async () => {
    console.log(
      'ui-designer.js addComponent: nextComponentId =',
      nextComponentId
    );
    const id = nextComponentId;
    await context.increment('nextComponentId');
    const props = {componentName: selectedComponent, id};
    const newPropsMap = {...propsMap, [id]: props};
    context.set('propsMap', newPropsMap);
  };

  const getComponents = propsMap => {
    const ids = Object.keys(propsMap);
    return ids.map(id => {
      const props = propsMap[id];
      const component = getComponent(props);
      if (!component) return null;
      return (
        <div
          className="container"
          key={'c' + id}
          onClick={() => toggleSelected(id)}
        >
          {component}
        </div>
      );
    });
  };

  const toggleSelected = id => {
    console.log('ui-designer.js toggleSelected: id =', id);
    const props = propsMap[id];
    const newPropsMap = {
      ...propsMap,
      [id]: {...props, selected: !props.selected}
    };
    context.set('propsMap', newPropsMap);
    console.log('ui-designer.js toggleSelected: newPropsMap =', newPropsMap);
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
        <Select path="selectedComponent">
          <option value="" />
          <option value="Clock">Clock</option>
          <option value="Date">Date</option>
        </Select>
        <button disabled={!selectedComponent} onClick={addComponent}>
          Add
        </button>
      </section>
      <section className="component-display">{getComponents(propsMap)}</section>
      <footer />
    </div>
  );
};
