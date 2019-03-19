export default {
  reformBoard(board) {
    if (board._embedded) {
      board.facilitator = board._embedded.facilitator;
      board.selected = board._embedded.selected;
      board.pillars = board._embedded.pillars;
      board.group = board._embedded.group;
    }
    return board;
  },

  reformGroup(group) {
    if (group._embedded) {
      group.boards = group._embedded.boards;
    }
    return group;
  },

  reform(resource) {
    return Object.assign(resource, resource._embedded);
  },

  deleteResource(resource) {
    let url = resource._links.self.href.replace('{?projection}', '');
    fetch(url, {
      method: 'delete',
    }).then(resp => {
      if (resp.ok) {
        resolve(resp);
      } else {
        reject(Error("failed to delete:", url));
      }
    });
  },

  fetchResource(resourceType) {
    let url = window.location.protocol + "//" + window.location.hostname + ":8080/api/" + resourceType;
    return this.get(url);
  },

  getSelfLink(resource) {
    if (resource && resource._links) {
      return resource._links.self.href.replace('{?projection}', '');
    }
    return null;
  },

  postPillar(pillar) {
    return this.postResource("pillars", pillar);
  },

  fetch(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(resp => {
          if (resp.ok) {
            resolve(resp.json());
          } else {
            reject(Error("failed to fetch:", url));
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
      fetch(`/${type}s`)
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
      fetch(`/${type}s`, {
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
