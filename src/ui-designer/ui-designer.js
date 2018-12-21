/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import {EasyContext, Select} from 'context-easy';
import React, {useContext} from 'react';
import {
  getComponent,
  getComponentNames,
  getConfig,
  getProperties
} from '../library';
import '../components';

import Pages from '../pages/pages';
import PropEditor from '../prop-editor/prop-editor';
import ToggleButtons from '../toggle-buttons/toggle-buttons';

import './ui-designer.scss';

const MODES = [{label: 'Edit'}, {label: 'Demo'}];

export default () => {
  const context = useContext(EasyContext);
  const {
    classPropsMap,
    instancePropsMap,
    lastComponentId,
    mode,
    selectedComponentName,
    selectedComponentId,
    selectedPage
  } = context;

  const isEdit = mode === 'Edit';
  const selectedComponent = instancePropsMap[selectedComponentId];
  const config = selectedComponent
    ? getConfig(selectedComponent.componentName)
    : {};

  const addComponent = async () => {
    const componentId = 'c' + (lastComponentId + 1);
    await context.increment('lastComponentId');

    const properties = {
      componentId,
      componentName: selectedComponentName,
      onPage: selectedPage
    };

    const newPropsMap = {...instancePropsMap, [componentId]: properties};
    context.set('instancePropsMap', newPropsMap);
  };

  const getComponents = instancePropsMap => {
    // Get an array of component ids on the selected page.
    const componentIds = Object.keys(instancePropsMap).filter(
      id => instancePropsMap[id].onPage === selectedPage
    );

    return componentIds.map(componentId => {
      const instanceProps = instancePropsMap[componentId];
      const classProps = classPropsMap[instanceProps.componentName];
      const properties = getProperties(classProps, instanceProps);
      const component = getComponent(properties);
      //if (!component) return null;

      //const styles = getNonStyles(properties);
      const className =
        'container' + (instanceProps.selected ? ' selected' : '');
      const onClick = isEdit ? () => toggleSelected(componentId) : null;
      const onMouseDown = isEdit ? mouseDown : null;
      return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <div
          className={className}
          id={componentId}
          key={componentId}
          onClick={onClick}
          onMouseDown={onMouseDown}
          // style={styles}
        >
          {component}
        </div>
      );
    });
  };

  // Based on https://javascript.info/mouse-drag-and-drop#drag-n-drop-algorithm
  const mouseDown = event => {
    event.preventDefault(); // necessary for dragging images

    const onMouseMove = event => moveAt(event.pageX, event.pageY);
    document.addEventListener('mousemove', onMouseMove);

    const element = event.target;
    console.log('ui-designer.js mouseDown: element =', element);
    element.onmouseup = () => {
      console.log('ui-designer.js onmouseup: entered');
      document.removeEventListener('mousemove', onMouseMove);
      element.onmouseup = null;
      const {left, top} = container.style;
      context.transform('instancePropsMap.' + container.id, properties => ({
        ...properties,
        left,
        top
      }));
    };

    // Find the container element.
    let container = element;
    while (true) {
      const classAttr = container.getAttribute('class');
      if (classAttr && classAttr.split(' ').includes('container')) break;
      container = container.parentElement;
    }
    //const element = container.firstChild;

    const {style} = container;
    const page = container.parentElement;
    const pageRect = page.getBoundingClientRect();
    const rect = container.getBoundingClientRect();

    const minX = pageRect.x;
    const minY = pageRect.y;
    const maxX = minX + pageRect.width - rect.width;
    const maxY = minY + pageRect.height - rect.height;

    const shiftX = event.pageX - rect.left;
    const shiftY = event.pageY - rect.top;

    function moveAt(pageX, pageY) {
      const x = pageX - shiftX;
      const y = pageY - shiftY;
      if (x < minX || x > maxX || y < minY || y > maxY) return;

      style.left = x + 'px';
      style.top = y + 'px';
    }
  };

  const toggleSelected = async componentId => {
    if (selectedComponentId) {
      await context.set(
        `instancePropsMap.${selectedComponentId}.selected`,
        false
      );
    }
    const different = componentId !== selectedComponentId;
    if (different) {
      await context.set(`instancePropsMap.${componentId}.selected`, true);
    }
    context.set(`selectedComponentId`, different ? componentId : '');
  };

  const componentNames = getComponentNames();

  return (
    <div className="ui-designer">
      <header>
        <h2>UI Designer</h2>
        <div>
          <label>
            Mode
            <ToggleButtons buttons={MODES} path="mode" />
          </label>
        </div>
      </header>
      {isEdit && (
        <section className="component-select">
          <Select path="selectedComponentName">
            <option value="" />
            {componentNames.map((name, index) => (
              <option key={'option' + index}>{name}</option>
            ))}
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
          {getComponents(instancePropsMap)}
        </section>
        {isEdit && selectedComponentId ? <PropEditor config={config} /> : null}
      </section>
      <footer />
    </div>
  );
};
