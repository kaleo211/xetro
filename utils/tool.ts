import { User } from "../models/user";

export interface keyable {
  [key: string]: any
}

export const date = (str: string) => {
  const date = new Date(str).toDateString();
  return date;
};

export const sleep = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const formatUserToSave = (user: keyable) => {
  let userToSave: User;

  userToSave.name = user.name;
  userToSave.firstName = user.given_name;
  userToSave.lastName = user.family_name;
  userToSave.email = user.email;

  // const attrs = user.user_attributes;
  // if (isBlank(attrs)) {
  //   throw new Error('invalid user attributes');
  // }
  // userToSave.title = isBlank(attrs.title) ? undefined : attrs.title[0];

  return userToSave;
}


export default {
  date,
  sleep,
  formatUserToSave,
};
