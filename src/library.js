import React from 'react';

const componentMap = {};
const configMap = {};
const defaultsMap = {};

export function getComponent(properties) {
  const {componentName} = properties;
  const component = componentMap[componentName];
  return React.createElement(component, properties);
}

export const getComponentNames = () => Object.keys(componentMap).sort();

export const getConfig = name => configMap[name];

export function getProperties(classProps = {}, instanceProps = {}) {
  const {componentName} = instanceProps;
  const defaults = defaultsMap[componentName];
  return {...defaults, ...classProps, ...instanceProps};
}

export function register(component, config) {
  const {name} = component;
  componentMap[name] = component;
  configMap[name] = config;

  // Create an object where keys are property names
  // and values are their default values.
  defaultsMap[name] = Object.keys(config).reduce((acc, key) => {
    const value = config[key].defaultValue;
    if (value !== undefined) acc[key] = value;
    return acc;
  }, {});
}
