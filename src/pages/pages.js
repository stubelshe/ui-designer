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

    context.set('pageName', '');
  };

  const deletePage = async name => {
    // Delete all the components on the page.
    await context.transform('propsMap', propsMap => {
      console.log('pages.js deletePage: propsMap =', propsMap);
      const ids = Object.keys(propsMap);
      console.log('pages.js deletePage: ids =', ids);
      return ids.reduce((map, id) => {
        console.log('pages.js deletePage: id =', id);
        const props = propsMap[id];
        console.log('pages.js deletePage: props =', props);
        // Keep components not on the page being deleted.
        if (props.page !== name) map[id] = props;
        return map;
      }, {});
    });

    // Delete the page.
    context.delete('pages.' + name);
  };

  const selectPage = name => {
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
