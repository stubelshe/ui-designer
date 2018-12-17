// These allow using onClick without onKeyPress.
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import {EasyContext, Input} from 'context-easy';
import React, {useContext} from 'react';
import './pages.scss';

// Prevent form submit.
const handleSubmit = e => e.preventDefault();

export default () => {
  const context = useContext(EasyContext);
  const {pageName, pages, selectedPage} = context;
  const pageNames = Object.keys(pages).sort();

  const addPage = async () => {
    // Add a new page.
    const newPage = {name: pageName};
    await context.transform('pages', pages => ({
      ...pages,
      [pageName]: newPage
    }));

    await context.set('selectedPage', pageName);
    context.set('pageName', '');
  };

  const clearSelections = async () => {
    await context.set('selectedComponentId', 0);
    await context.transform('instancePropsMap', instancePropsMap => {
      const ids = Object.keys(instancePropsMap);
      return ids.reduce((map, id) => {
        const properties = instancePropsMap[id];
        map[id] = {...properties, selected: false};
        return map;
      }, {});
    });
  };

  const deletePage = async name => {
    // Delete all the components on the page.
    await context.transform('instancePropsMap', instancePropsMap => {
      const ids = Object.keys(instancePropsMap);
      return ids.reduce((map, id) => {
        const properties = instancePropsMap[id];
        // Keep components not on the page being deleted.
        if (properties.page !== name) map[id] = properties;
        return map;
      }, {});
    });

    // Delete the page.
    await context.delete('pages.' + name);
    clearSelections();
  };

  const selectPage = async name => {
    await clearSelections();
    context.set('selectedPage', name);
  };

  return (
    <div className="pages">
      <h3>Pages</h3>
      <div className="new-page">
        <form onSubmit={handleSubmit}>
          <Input path="pageName" />
          <button className="add-btn" onClick={addPage}>
            +
          </button>
        </form>
      </div>
      {pageNames.map((name, index) => (
        <div
          className={'page ' + (name === selectedPage ? ' selected' : '')}
          key={'page' + index}
        >
          <span onClick={() => selectPage(name)}>{name}</span>
          <button className="delete-btn" onClick={() => deletePage(name)}>
            X
          </button>
        </div>
      ))}
    </div>
  );
};
