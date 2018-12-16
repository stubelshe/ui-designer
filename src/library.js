import React from 'react';

const componentMap = {};
const configMap = {};

export function getComponent(props) {
  const component = componentMap[props.componentName];
  return React.createElement(component, props);
}

export const getComponentNames = () => Object.keys(componentMap).sort();

export const getConfig = name => configMap[name];

export function register(component, config) {
  componentMap[component.name] = component;
  configMap[component.name] = config;
}
