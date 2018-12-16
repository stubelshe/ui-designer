import {EasyContext} from 'context-easy';
import React, {useContext} from 'react';
import {register} from '../library';

const kinds = ['button', 'link'];

const config = {
  backgroundColor: {
    type: 'color',
    defaultValue: '#FFFFFF'
  },
  color: {
    type: 'color',
    defaultValue: '#0000FF'
  },
  fontFamily: {
    type: 'fontFamily',
    defaultValue: 'sans-serif'
  },
  fontSize: {
    type: 'fontSize',
    defaultValue: 18
  },
  kind: {
    type: 'multipleChoice',
    options: kinds.map(kind => ({label: kind})),
    defaultValue: kinds[0]
  },
  page: {
    type: 'text'
  },
  text: {
    type: 'text',
    defaultValue: 'replace'
  }
};

function NavItem(props) {
  const {kind, page, text} = props;
  const context = useContext(EasyContext);
  const navigate = () => context.set('page', page);
  return kind === 'button' ? (
    <button onClick={navigate} style={props}>
      {text}
    </button>
  ) : (
    <a href="" onClick={navigate}>
      {text}
    </a>
  );
}

register(NavItem, config);
