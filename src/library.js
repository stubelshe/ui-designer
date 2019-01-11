import React from 'react';

const componentMap = {};
const configMap = {};
const defaultsMap = {};

export function clearInstanceProperties(context, componentId) {
  const instanceProps = context.instancePropsMap[componentId];
  const {componentName} = instanceProps;
  const classProps = context.classPropsMap[componentName] || {};
  const defaults = defaultsMap[componentName];

  const config = configMap[componentName];
  const copy = {...instanceProps};
  Object.keys(config).forEach(
    key => (copy[key] = classProps[key] || defaults[key])
  );
  context.set(`instancePropsMap.${componentId}`, copy);
}

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

export async function toggleSelected(context, componentId) {
  const {selectedComponentId} = context;
  if (selectedComponentId) {
    context.set(`instancePropsMap.${selectedComponentId}.selected`, false);
  }
  const different = componentId !== selectedComponentId;
  if (different) {
    context.set(`instancePropsMap.${componentId}.selected`, true);
  }
  context.set(`selectedComponentId`, different ? componentId : '');
}
