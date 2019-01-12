import {
  faIgloo,
  faPen,
  faPlus,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import {library} from '@fortawesome/fontawesome-svg-core';
import {EasyProvider} from 'context-easy';
import React, {Component} from 'react';
import UIDesigner from './ui-designer/ui-designer';

import './App.scss';

library.add(faIgloo);
library.add(faPen);
library.add(faPlus);
library.add(faTrash);

const initialState = {
  classPropsMap: {},
  editingPageName: false,
  instancePropsMap: {},
  lastComponentId: 0,
  mode: 'Edit',
  newPageName: '',
  pageName: '',
  pages: {},
  propScope: 'instance',
  selectedComponentId: 0,
  selectedComponentName: '', // from dropdown
  selectedPage: ''
};

class App extends Component {
  render() {
    return (
      <EasyProvider initialState={initialState} log validate>
        <div className="App">
          <UIDesigner />
        </div>
      </EasyProvider>
    );
  }
}

export default App;
