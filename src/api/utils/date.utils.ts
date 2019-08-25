/**
 * @description Get age from birthdate
 * @param {string} dateString 
 */
const getAge = ( dateString ) => {
  var today = new Date();
  var birthDate = new Date( dateString );
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if ( m < 0 || ( m === 0 && today.getDate() < birthDate.getDate() ) ) {
    age--;
  }
  return age;
}

export { getAge }