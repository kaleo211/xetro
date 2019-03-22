export default {
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  reform(resource) {
    return Object.assign(resource, resource._embedded);
  },

  postPillar(pillar) {
    return this.postResource("pillars", pillar);
  },

  search(type, body) {
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
          reject(Error("failed to search:", type, body));
        }
      });
    });
  },

  get(type, id) {
    return new Promise((resolve, reject) => {
      fetch(`/${type}/${id}`)
        .then(resp => {
          if (resp.ok) {
            resolve(resp.json());
          } else {
            reject(Error("failed to get:", type, id));
          }
        });
    });
  },

  list(type) {
    return new Promise((resolve, reject) => {
      fetch(`/${type}`)
        .then(resp => {
          if (resp.ok) {
            resolve(resp.json());
          } else {
            reject(Error("failed to get:", type));
          }
        });
    });
  },

  post(type, body) {
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
          reject(Error("failed to post:", type, body));
        }
      });
    });
  },

  patch(type, body) {
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
          reject(Error("failed to patch:", type, body));
        }
      });
    });
  },

  delete(resource, id) {
    return new Promise((resolve, reject) => {
      fetch(`/${resource}/${id}`, {
        method: 'DELETE',
      }).then(resp => {
        if (resp.ok) {
          resolve(resp);
        } else {
          reject(Error("failed to delete:", url));
        }
      });
    });
  },
}
