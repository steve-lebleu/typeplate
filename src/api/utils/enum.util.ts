/**
 * @description List enum values
 * @param en Enum to list
 */
const list = ( en: any ): string[] => {
  const list = [];
  for(const item in en) {
    list.push(en[item]);
  }
  return list;
};

export { list };