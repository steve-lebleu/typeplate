/**
 * @description Get age from birthdate
 * @param dateString
 */
const getAge = ( dateString: string ): number => {
  const today = new Date();
  const birthDate = new Date( dateString );
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if ( m < 0 || ( m === 0 && today.getDate() < birthDate.getDate() ) ) {
    age--;
  }
  return age;
}

export { getAge }