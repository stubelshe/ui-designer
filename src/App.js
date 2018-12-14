import {EasyProvider} from 'context-easy';
import React, {Component} from 'react';
import UIDesigner from './ui-designer/ui-designer';
import './App.scss';

const initialState = {
  components: [],
  mode: 'edit', // 'test'
  selectedComponent: ''
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
