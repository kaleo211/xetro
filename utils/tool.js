const isBlank = (obj) => {
  if (obj === '' || obj == null || obj === undefined) {
    return true;
  }
  const isEmptyObj = obj.constructor === Object && Object.keys(obj).length === 0;
  const isEmptyArr = Array.isArray(obj) && obj.length === 0;
  return isEmptyObj || isEmptyArr;
};

module.exports = {
  isBlank,
};
