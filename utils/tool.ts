
export const date = (str: string) => {
  const d = new Date(str).toDateString();
  return d;
};

export const sleep = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export default {
  date,
  sleep,
};
