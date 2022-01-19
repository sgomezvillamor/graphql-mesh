import { camelCase } from 'change-case';

export function getFieldNameFromPath(path: string, method: string, typeName: string) {
  // Replace identifiers with "by"
  path = path.split('{').join('by_').split('}').join('');

  const [actualPartsStr, allQueryPartsStr] = path.split('?');

  const actualParts = actualPartsStr.split('/').filter(Boolean);

  let fieldNameWithoutMethod = actualParts.join('_');

  // If path doesn't give any field name without identifiers, we can use the return type with HTTP Method name
  if ((!fieldNameWithoutMethod || fieldNameWithoutMethod.startsWith('by')) && typeName) {
    // lowercase looks better in the schema
    const prefix = camelCase(typeName);
    if (fieldNameWithoutMethod) {
      fieldNameWithoutMethod = prefix + '_' + fieldNameWithoutMethod;
    } else {
      fieldNameWithoutMethod = prefix;
    }
  }

  if (allQueryPartsStr) {
    const queryParts = allQueryPartsStr.split('&');
    for (const queryPart of queryParts) {
      const [queryName] = queryPart.split('=');
      fieldNameWithoutMethod += '_' + 'by' + '_' + queryName;
    }
  }

  // get_ doesn't look good in field names
  const methodPrefix = method.toLowerCase();
  if (methodPrefix === 'get') {
    return fieldNameWithoutMethod;
  }
  return methodPrefix + '_' + fieldNameWithoutMethod;
}
