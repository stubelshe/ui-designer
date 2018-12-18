import React from 'react';

const componentMap = {};
const configMap = {};

export function getComponent(properties) {
  const {componentName} = properties;
  const component = componentMap[componentName];
  return React.createElement(component, properties);
}

export const getComponentNames = () => Object.keys(componentMap).sort();

export const getConfig = name => configMap[name];

export function getProperties(classProps, instanceProps) {
  const {componentName} = instanceProps;
  const config = getConfig(componentName);
  const properties = Object.keys(config).reduce((acc, key) => {
    const value = config[key].defaultValue;
    if (value !== undefined) acc[key] = value;
    return acc;
  }, {});
  return {...properties, ...classProps, ...instanceProps};
}

export function register(component, config) {
  componentMap[component.name] = component;
  configMap[component.name] = config;
}
