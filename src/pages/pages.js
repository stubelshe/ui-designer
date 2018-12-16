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
    await context.transform('propsMap', propsMap => {
      const ids = Object.keys(propsMap);
      return ids.reduce((map, id) => {
        const props = propsMap[id];
        map[id] = {...props, selected: false};
        return map;
      }, {});
    });
  };

  const deletePage = async name => {
    // Delete all the components on the page.
    await context.transform('propsMap', propsMap => {
      const ids = Object.keys(propsMap);
      return ids.reduce((map, id) => {
        const props = propsMap[id];
        // Keep components not on the page being deleted.
        if (props.page !== name) map[id] = props;
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
