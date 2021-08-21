import { Keyable } from '../types/common';

export const createdAt = () => {
  return (a: Keyable, b: Keyable) => {
    let comparison = 0;
    if (a.createdAt > b.createdAt) {
      comparison = 1;
    } else {
      comparison = -1;
    }
    return comparison;
  };
};

export const makeRequest = async (url: string, method: string, body: Keyable, expectingStatus: number, expectingJSON: boolean): Promise<Keyable> => {
  try {
    let options: any = {
      method,
    }

    if (body) {
      options = {
        ...options,
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(body),
      }
    }

    const resp = await fetch(url, options);
    if (resp.status !== expectingStatus) {
      console.error('error receiving unexpected status code:', resp.status);
      return null;
    }

    if (expectingJSON) {
      return await resp.json();
    }

    return null;

  } catch (err) {
    console.error('error making request to backend:', err);
    return null;
  }
}

export const searchReq = async (type:string, body:Keyable): Promise<Keyable> => {
  const receivedBody = await makeRequest(`/${type}/search`, 'POST', body, 200, true);
  return receivedBody;
}

export const fetchReq = async (url: string): Promise<Keyable> => {
  const receivedBody = await makeRequest(url, 'GET', null, 200, true);
  return receivedBody;
};

export const touchReq = async (url: string): Promise<void> => {
  await makeRequest(url, 'GET', null, 200, false);
};

export const getReq = async (resource: string, id: string): Promise<Keyable> => {
  const receivedBody = await makeRequest(`/${resource}/${id}`, 'GET', null, 200, true);
  return receivedBody;
};

export const listReq = async (resource: string): Promise<Keyable> => {
  const receivedBody = await makeRequest(`/${resource}`, 'GET', null, 200, true);
  return receivedBody;
};

export const postReq = async (resource: string, body: Keyable): Promise<Keyable> => {
  const receivedBody = await makeRequest(`/${resource}`, 'POST', body, 200, true);
  return receivedBody;
};

export const patchReq = async (resource: string, body: Keyable): Promise<Keyable> => {
  const receivedBody = await makeRequest(`/${resource}/${body.id}`, 'PATCH', body, 200, true);
  return receivedBody;
};

export const deleteReq = async (resource: string, id: string): Promise<void> => {
  await makeRequest(`/${resource}/${id}`, 'PATCH', null, 200, false);
};
