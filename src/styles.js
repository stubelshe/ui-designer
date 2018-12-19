const STYLES = new Set([
  'backgroundColor',
  'color',
  'fontFamily',
  'fontSize',
  'height',
  'width'
]);

export const getNonStyles = properties =>
  Object.keys(properties).reduce((obj, key) => {
    if (!STYLES.has(key)) obj[key] = properties[key];
    return obj;
  }, {});

export const getStyles = properties =>
  Object.keys(properties).reduce((obj, key) => {
    if (STYLES.has(key)) obj[key] = properties[key];
    return obj;
  }, {});
