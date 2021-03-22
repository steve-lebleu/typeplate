"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAge = void 0;
/**
 * @description Get age from birthdate
 * @param dateString
 */
const getAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};
exports.getAge = getAge;
