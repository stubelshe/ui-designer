import {string} from 'prop-types';
import React from 'react';
import {register} from '../library';
import {getStyles} from '../styles';

import './image.scss';

const config = {
  backgroundColor: {
    type: 'color',
    defaultValue: '#FFFFFF'
  },
  alt: {
    type: 'text',
    defaultValue: ''
  },
  url: {
    type: 'text',
    defaultValue: 'http://localhost:3000/whippet.jpg'
  }
};

function Image(props) {
  const {alt, url} = props;
  const style = getStyles(props);
  return <img className="image" alt={alt} src={url} style={style} />;
}

Image.propTypes = {
  alt: string.isRequired,
  url: string.isRequired
};

register(Image, config, 3, 3);
