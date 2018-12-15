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
    const page = {name: pageName};
    await context.transform('pages', pages => ({...pages, [pageName]: page}));
    context.set('pageName', '');
  };

  const deletePage = name => {
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
      {pageNames.map(name => (
        <div className={'page ' + (name === selectedPage ? ' selected' : '')}>
          <span onClick={() => selectPage(name)}>{name}</span>
          <button className="delete-btn" onClick={() => deletePage(name)}>
            X
          </button>
        </div>
      ))}
    </div>
  );
};
