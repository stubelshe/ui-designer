/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import {EasyContext} from 'context-easy';
import React, {useContext} from 'react';
import GridLayout from 'react-grid-layout';

import '../components';
import {
  getComponent,
  getConfig,
  getProperties,
  toggleSelected
} from '../library';
import ComponentSelect from '../component-select/component-select';
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
    mode,
    selectedComponentId,
    selectedPage
  } = context;

  const isEdit = mode === 'Edit';
  const selectedComponent = instancePropsMap[selectedComponentId];
  const config = selectedComponent
    ? getConfig(selectedComponent.componentName)
    : {};

  const getComponents = instancePropsMap => {
    // Get an array of component ids on the selected page.
    const componentIds = Object.keys(instancePropsMap).filter(
      id => instancePropsMap[id].onPage === selectedPage
    );

    return componentIds.map((componentId, index) => {
      const instanceProps = instancePropsMap[componentId];
      const classProps = classPropsMap[instanceProps.componentName];
      const properties = getProperties(classProps, instanceProps);
      const component = getComponent(properties);

      const className =
        'container' + (instanceProps.selected ? ' selected' : '');
      return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <div
          className={className}
          key={componentId}
          i={componentId}
          x={index}
          y={0}
          w={1}
          h={1}
          onClick={() => toggleSelected(context, componentId)}
        >
          {component}
        </div>
      );
    });
  };

  /*
  // Based on https://javascript.info/mouse-drag-and-drop#drag-n-drop-algorithm
  const mouseDown = event => {
    const downTimestamp = event.timeStamp;
    event.preventDefault(); // necessary for dragging images

    const removeMouseMoveListener = () =>
      document.removeEventListener('mousemove', onMouseMove);
    middle.addEventListener('mouseout', removeMouseMoveListener);

    function moveAt(pageX, pageY) {
      const x = pageX - shiftX;
      const y = pageY - shiftY;
      if (x < minX || x > maxX || y < minY || y > maxY) return;

      style.left = x + 'px';
      style.top = y + 'px';
    }

    const onMouseMove = event => moveAt(event.pageX, event.pageY);
    document.addEventListener('mousemove', onMouseMove);

    const element = event.target;
    element.onmouseup = event => {
      // If the mousedown and mouseup events were close together,
      // toggle whether the component is selected.
      const upTimestamp = event.timeStamp;
      const deltaTime = upTimestamp - downTimestamp;
      if (deltaTime < 300) toggleSelected(context, container.id);

      document.removeEventListener('mousemove', onMouseMove);
      middle.removeEventListener('mouseout', removeMouseMoveListener);
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
  };
  */

  return (
    <div className="ui-designer">
      <header>
        <img alt="logo" className="logo" src="logo.png" />
        <ToggleButtons buttons={MODES} path="mode" />
      </header>
      <section className="main">
        {isEdit && <Pages />}
        <div className="middle">
          {isEdit && <ComponentSelect />}
          <GridLayout
            autoSize={false}
            className={'layout component-display' + (isEdit ? ' edit' : '')}
            cols={12}
            rowHeight={50}
            width={1000}
          >
            {getComponents(instancePropsMap)}
          </GridLayout>
        </div>
        {isEdit && selectedComponentId ? <PropEditor config={config} /> : null}
      </section>
      <footer />
    </div>
  );
};
