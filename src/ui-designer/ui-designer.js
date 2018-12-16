/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import {EasyContext, Select} from 'context-easy';
import React, {useContext} from 'react';
import {getComponent, getComponentNames, getConfig} from '../library';

import '../components';

import Pages from '../pages/pages';
import PropEditor from '../prop-editor/prop-editor';
import ToggleButtons from '../toggle-buttons/toggle-buttons';

import './ui-designer.scss';

const MODES = ['Edit', 'Demo'];

const STYLES = new Set(['backgroundColor', 'color', 'fontFamily', 'fontSize']);

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
    ? getConfig(selectedComponent.componentName)
    : {};

  const addComponent = async () => {
    const componentId = 'c' + (lastComponentId + 1);
    await context.increment('lastComponentId');

    const properties = {
      componentId,
      componentName: selectedComponentName,
      page: selectedPage
    };
    const config = getConfig(selectedComponentName);
    Object.keys(config).forEach(key => {
      const {defaultValue} = config[key];
      if (defaultValue) properties[key] = defaultValue;
    });

    const newPropsMap = {...propsMap, [componentId]: properties};
    context.set('propsMap', newPropsMap);
  };

  const getComponents = propsMap => {
    // Get an array of component ids on the selected page.
    const componentIds = Object.keys(propsMap).filter(
      id => propsMap[id].page === selectedPage
    );

    return componentIds.map(componentId => {
      const properties = propsMap[componentId];
      const component = getComponent(properties);
      if (!component) return null;

      const styles = Object.keys(properties).reduce((obj, key) => {
        if (STYLES.has(key)) obj[key] = properties[key];
        return obj;
      }, {});

      const className = 'container' + (properties.selected ? ' selected' : '');
      return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <div
          className={className}
          id={componentId}
          key={componentId}
          onClick={() => toggleSelected(componentId)}
          onMouseDown={mouseDown}
          style={styles}
        >
          {component}
        </div>
      );
    });
  };

  // Based on https://javascript.info/mouse-drag-and-drop#drag-n-drop-algorithm
  const mouseDown = event => {
    const element = event.target;
    const container = element.parentElement;
    const {style} = container;
    const page = container.parentElement;
    const pageRect = page.getBoundingClientRect();
    const rect = element.getBoundingClientRect();

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

    const onMouseMove = event => moveAt(event.pageX, event.pageY);
    document.addEventListener('mousemove', onMouseMove);
    element.onmouseup = () => {
      document.removeEventListener('mousemove', onMouseMove);
      element.onmouseup = null;
      const {left, top} = container.style;
      context.transform('propsMap.' + container.id, properties => ({
        ...properties,
        left,
        top
      }));
    };
  };

  const toggleSelected = async componentId => {
    if (selectedComponentId) {
      await context.set(`propsMap.${selectedComponentId}.selected`, false);
    }
    const different = componentId !== selectedComponentId;
    if (different) await context.set(`propsMap.${componentId}.selected`, true);
    context.set(`selectedComponentId`, different ? componentId : 0);
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
          {getComponents(propsMap)}
        </section>
        {isEdit && selectedComponentId ? <PropEditor config={config} /> : null}
      </section>
      <footer />
    </div>
  );
};
