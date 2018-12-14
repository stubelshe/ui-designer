import {EasyContext, Select} from 'context-easy';
import React, {useContext} from 'react';

import Clock from '../clock/clock';
import Date from '../date/date';
import ToggleButtons from '../toggle-buttons/toggle-buttons';

import './ui-designer.scss';

const buttons = [{text: 'Edit'}, {text: 'Test'}];

function getComponent(name) {
  switch (name) {
    case 'Clock':
      return <Clock />;
    case 'Date':
      return <Date />;
    default:
  }
}

export default () => {
  const context = useContext(EasyContext);
  const {components, selectedComponent} = context;
  console.log('ui-designer.js: components =', components);

  const addComponent = () => {
    const index = components.length;
    const container = (
      <div
        className="container"
        key={'c' + index}
        onClick={() => toggleSelected(index)}
      >
        {getComponent(selectedComponent)}
      </div>
    );
    context.push('components', container);
  };

  const toggleSelected = index => {
    console.log('ui-designer.js toggleSelected: index =', index);
    console.log('ui-designer.js toggleSelected: components =', components);
    const component = components[index];
    console.log('ui-designer.js toggleSelected: component =', component);
    //component.selected = !component.selected;
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
      <section className="component-display">{components}</section>
      <footer />
    </div>
  );
};
