export const isBlank = (obj) => {
  if (obj === '' || obj == null || obj === undefined) {
    return true;
  }
  const isEmptyObj = obj.constructor === Object && Object.keys(obj).length === 0;
  const isEmptyArr = Array.isArray(obj) && obj.length === 0;
  return isEmptyObj || isEmptyArr;
};

export const date = (str) => {
  const date = new Date(str).toDateString();
  return date;
};

export const sleep = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};


export default {
  date,
  isBlank,
  sleep,
};
