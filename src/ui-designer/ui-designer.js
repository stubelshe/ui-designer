import {EasyContext, Select} from 'context-easy';
import React, {useContext} from 'react';

import Clock, {config as clockConfig} from '../clock/clock';
import Date, {config as dateConfig} from '../date/date';
import Pages from '../pages/pages';
import PropEditor from '../prop-editor/prop-editor';
import ToggleButtons from '../toggle-buttons/toggle-buttons';

import './ui-designer.scss';

const modes = ['Edit', 'Demo'];

const PADDING = 10;

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
        >
          {component}
        </div>
      );
    });
  };

  const mouseDown = event => {
    const element = event.target;
    const {style} = element;
    const parentRect = element.parentElement.getBoundingClientRect();
    const rect = element.getBoundingClientRect();

    const minX = parentRect.x;
    const minY = parentRect.y;
    const maxX = minX + parentRect.width - rect.width;
    const maxY = minY + parentRect.height - rect.height;

    const shiftX = event.pageX - rect.left + PADDING;
    const shiftY = event.pageY - rect.top + PADDING;

    function moveAt(pageX, pageY) {
      const x = pageX - shiftX;
      const y = pageY - shiftY;
      if (x < minX || y < minY || (x > maxX) | (y > maxY)) return;

      style.left = x + 'px';
      style.top = y + 'px';
    }

    const onMouseMove = event => moveAt(event.pageX, event.pageY);
    document.addEventListener('mousemove', onMouseMove);
    element.onmouseup = () => {
      document.removeEventListener('mousemove', onMouseMove);
      element.onmouseup = null;
    };
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
        <section className={'component-display' + (isEdit ? ' edit' : '')}>
          {getComponents(propsMap)}
        </section>
        {isEdit && selectedComponentId ? <PropEditor config={config} /> : null}
      </section>
      <footer />
    </div>
  );
};
