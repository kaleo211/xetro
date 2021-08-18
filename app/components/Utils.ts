import { keyable } from "../../utils/tool";

export default {
  createdAt() {
    return (a:keyable, b:keyable) => {
      let comparison = 0;
      if (a.createdAt > b.createdAt) {
        comparison = 1;
      } else {
        comparison = -1;
      }
      return comparison;
    };
  },

  search(type:string, body:keyable): Promise<keyable> {
    return new Promise((resolve, reject) => {
      fetch(`/${type}/search`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(body),
      }).then(resp => {
        if (resp.ok) {
          resolve(resp.json());
        } else {
          reject(Error(`failed to search: ${type}`));
        }
      });
    });
  },

  fetch(uri:string): Promise<keyable> {
    return new Promise(resolve => {
      fetch(uri)
        .then(resp => {
          if (resp.ok) {
            resolve(resp.json());
          } else {
            resolve(undefined);
          }
        });
    });
  },

  get(type:string, id:string): Promise<keyable> {
    return new Promise((resolve, reject) => {
      fetch(`/${type}/${id}`)
        .then(resp => {
          if (resp.ok) {
            resolve(resp.json());
          } else {
            reject(Error(`failed to get: ${type}`));
          }
        });
    });
  },

  list(type:string): Promise<keyable> {
    return new Promise((resolve, reject) => {
      fetch(`/${type}`)
        .then(resp => {
          if (resp.ok) {
            resolve(resp.json());
          } else {
            reject(Error(`failed to get: ${type}`));
          }
        });
    });
  },

  post(type:string, body:keyable): Promise<keyable> {
    return new Promise((resolve, reject) => {
      fetch(`/${type}`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      }).then(resp => {
        if (resp.ok) {
          resolve(resp.json());
        } else {
          reject(Error(`failed to post: ${type}`));
        }
      });
    });
  },

  patch(type:string, body:keyable): Promise<keyable> {
    return new Promise((resolve, reject) => {
      fetch(`/${type}/${body.id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      }).then(resp => {
        if (resp.ok) {
          resolve(resp.json());
        } else {
          reject(Error(`failed to patch: ${type}`));
        }
      });
    });
  },

  delete(type:string, id:string): Promise<keyable> {
    return new Promise((resolve, reject) => {
      fetch(`/${type}/${id}`, {
        method: 'DELETE',
      }).then(resp => {
        if (resp.ok) {
          resolve(resp);
        } else {
          reject(Error(`failed to delete: ${type}`));
        }
      });
    });
  },
};
