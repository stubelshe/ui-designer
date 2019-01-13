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
          w={2}
          h={1}
          onClick={() => toggleSelected(context, componentId)}
        >
          {component}
        </div>
      );
    });
  };

  const layoutKey = `ui-designer/${selectedPage}/layout`;

  function getLayout(page) {
    const json = sessionStorage.getItem(layoutKey);
    return json ? JSON.parse(json) : [];
  }

  function saveLayout(layout) {
    // Don't save the layout if we are changing the current page.
    // react-grid-layout really shouldn't
    // trigger onLayoutChange when this happens!
    if (sessionStorage.getItem('page-changed')) {
      sessionStorage.removeItem('page-changed');
      return;
    }

    sessionStorage.setItem(layoutKey, JSON.stringify(layout));
  }

  const layout = getLayout(selectedPage);

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
            layout={layout}
            onLayoutChange={saveLayout}
            rowHeight={41}
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
