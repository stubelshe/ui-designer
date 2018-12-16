import React from 'react';

const componentMap = {};
const configMap = {};

export function getComponent(properties) {
  const component = componentMap[properties.componentName];
  return React.createElement(component, properties);
}

export const getComponentNames = () => Object.keys(componentMap).sort();

export const getConfig = name => configMap[name];

export function register(component, config) {
  componentMap[component.name] = component;
  configMap[component.name] = config;
}
