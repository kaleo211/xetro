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

export default {
  date,
  sleep,
};
