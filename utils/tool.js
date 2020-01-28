const isBlank = (obj) => {
  if (obj === '' || obj == null || obj === undefined) {
    return true;
  }
  const isEmptyObj = obj.constructor === Object && Object.keys(obj).length === 0;
  const isEmptyArr = Array.isArray(obj) && obj.length === 0;
  return isEmptyObj || isEmptyArr;
};

const date = (str) => {
  const date = new Date(str).toDateString();
  return date;
};

const sleep = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports = {
  date,
  isBlank,
  sleep,
};
