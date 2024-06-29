export function getObjectTypeName(obj: any): string {
  if (obj === null) return 'null';
  if (obj === undefined) return 'undefined';
  
  if (typeof obj === 'object' && obj.constructor) {
    return obj.constructor.name;
  } else if (typeof obj === 'function') {
    return obj.name;
  } else if (typeof obj === 'object') {
    return 'Object';
  }

  return typeof obj;
}