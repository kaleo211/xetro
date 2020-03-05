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

const formatUserToSave = (user) => {
  const userToSave = {};
  if (isBlank(user)) {
    throw new Error('user is not valid');
  }

  userToSave.username = user.user_name;
  userToSave.name = user.name;
  userToSave.firstName = user.given_name;
  userToSave.lastName = user.family_name;
  userToSave.email = user.email;

  const attrs = user.user_attributes;
  if (isBlank(attrs)) {
    throw new Error('invalid user attributes');
  }

  userToSave.badgeID = isBlank(attrs.uid) ? undefined : attrs.uid[0];
  userToSave.title = isBlank(attrs.title) ? undefined : attrs.title[0];

  return userToSave;
}

module.exports = {
  date,
  isBlank,
  sleep,
  formatUserToSave,
};
