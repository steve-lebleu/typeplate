/**
 * @description List enum values
 * @param enm Enum to list
 */
const list = ( enm: any ): string[] => {
  const values = [];
  for(const item in enm) {
    values.push(enm[item]);
  }
  return values;
};

export { list };