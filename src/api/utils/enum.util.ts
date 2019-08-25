/**
 * @description List enum values
 * @param {enum} en Enum to list 
 */
const list = ( en: any ): string[] => {
  const list = [];
  for(let item in en) {
    list.push(en[item]);
  }
  return list;
};

export { list };