import {EasyContext, Select} from 'context-easy';
import React, {useContext, useRef} from 'react';

import Clock, {config as clockConfig} from '../clock/clock';
import Date, {config as dateConfig} from '../date/date';
import Pages from '../pages/pages';
import PropEditor from '../prop-editor/prop-editor';
import ToggleButtons from '../toggle-buttons/toggle-buttons';

import './ui-designer.scss';

const modes = ['Edit', 'Demo'];

const configMap = {
  Clock: clockConfig,
  Date: dateConfig
};

let dragging, dx, dy;

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
  const dragRef = useRef(null);
  const {
    lastComponentId,
    mode,
    propsMap,
    selectedComponentName,
    selectedComponentId,
    selectedPage
  } = context;

  const isEdit = mode === 'Edit';
  const selectedComponent = propsMap[selectedComponentId];
  const config = selectedComponent
    ? configMap[selectedComponent.componentName]
    : {};

  const addComponent = async () => {
    const componentId = lastComponentId + 1;
    await context.increment('lastComponentId');

    const props = {
      componentId,
      componentName: selectedComponentName,
      page: selectedPage
    };
    const config = configMap[selectedComponentName];
    Object.keys(config).forEach(key => {
      const {defaultValue} = config[key];
      if (defaultValue) props[key] = defaultValue;
    });

    const newPropsMap = {...propsMap, [componentId]: props};
    context.set('propsMap', newPropsMap);
  };

  const getComponents = propsMap => {
    // Get an array of component ids on the selected page.
    const componentIds = Object.keys(propsMap).filter(
      id => propsMap[id].page === selectedPage
    );

    return componentIds.map(componentId => {
      const props = propsMap[componentId];
      const component = getComponent(props);
      if (!component) return null;

      const className = 'container' + (props.selected ? ' selected' : '');
      const id = 'c' + componentId;
      return (
        <div
          className={className}
          id={id}
          key={id}
          onClick={() => toggleSelected(componentId)}
          onMouseDown={mouseDown}
          onMouseUp={mouseUp}
        >
          {component}
        </div>
      );
    });
  };

  const mouseDown = event => {
    dragRef.current = event.target;
  };

  const mouseMove = event => {
    if (dragRef.current) {
      const domElement = dragRef.current;
      const {clientX, clientY} = event;
      if (!dragging) {
        dragging = true;
        const rect = domElement.getBoundingClientRect();
        dx = clientX - rect.x;
        dy = clientY - rect.y;
        console.log('ui-designer.js mouseMove: dx dy =', dx, dy);
      }
      const left = clientX - dx;
      const top = clientY - dy;
      const {style} = domElement;
      style.left = left + 'px';
      style.top = top + 'px';
    }
  };

  const mouseUp = event => {
    dragRef.current = null;
    dragging = false;
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
          <ToggleButtons buttons={modes} path="mode" />
        </div>
      </header>
      {isEdit && (
        <section className="component-select">
          <Select path="selectedComponentName">
            <option value="" />
            <option value="Clock">Clock</option>
            <option value="Date">Date</option>
          </Select>
          <button
            disabled={!selectedPage || !selectedComponentName}
            onClick={addComponent}
          >
            Add
          </button>
        </section>
      )}
      <section className="main">
        {isEdit && <Pages />}
        <section
          className={'component-display' + (isEdit ? ' edit' : '')}
          onMouseMove={mouseMove}
        >
          {getComponents(propsMap)}
        </section>
        {isEdit && selectedComponentId ? <PropEditor config={config} /> : null}
      </section>
      <footer />
    </div>
  );
};
