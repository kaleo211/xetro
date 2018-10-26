import "isomorphic-fetch";

export default {
  reformBoard(board) {
    if (board._embedded) {
      board.facilitator = board._embedded.facilitator;
      board.selected = board._embedded.selected;
      board.pillars = board._embedded.pillars;
      board.team = board._embedded.team;
    }
    return board;
  },

  reformTeam(team) {
    if (team._embedded) {
      team.boards = team._embedded.boards;
    }
    return team;
  },

  reform(resource) {
    return Object.assign(resource, resource._embedded);
  },

  prepend(path) {
    return window.location.protocol + "//" + window.location.hostname + ":8080/api/" + path;
  },

  get(url) {
    return new Promise((resolve, reject) => {
      if (url) {
        fetch(url.replace('{?projection}', ''))
          .then(resp => {
            if (resp.ok) {
              resolve(resp.json());
            } else {
              reject(Error("failed to get:", url));
            }
          });
      }
    });
  },

  delete(resource) {
    let url = this.prepend(resource);
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'delete',
      }).then(resp => {
        if (resp.ok) {
          resolve(resp);
        } else {
          resolve(Error("failed to delete:", url));
        }
      });
    });
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

  postTeamMember(teamMember) {
    return this.postResource("teamMember", teamMember);
  },

  postResource(resourceType, resource) {
    let url = window.location.protocol + "//" + window.location.hostname + ":8080/api/" + resourceType;
    console.log("url", url);
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(resource),
        headers: new Headers({
          'Content-Type': 'application/json',
        })
      }).then(resp => {
        if (resp.ok) {
          resolve(resp.json());
        } else {
          reject(Error("failed to post:", resourceType, resource));
        }
      });
    });
  },

  patch(resource, updatedResource) {
    let url = this.prepend(resource);
    if (url) {
      return new Promise((resolve, reject) => {
        fetch(url, {
          method: 'PATCH',
          body: JSON.stringify(updatedResource),
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
        }).then(resp => {
          if (resp.ok) {
            resolve(resp.json());
          } else {
            reject(Error("failed to patch:", resource, updatedResource));
          }
        });
      });
    }
  },

  patchResource(resource, updatedResource) {
    return new Promise((resolve, reject) => {
      let url = this.getSelfLink(resource);
      if (url) {
        fetch(url, {
          method: 'PATCH',
          body: JSON.stringify(updatedResource),
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
        }).then(resp => {
          if (resp.ok) {
            resolve(resp.json());
          } else {
            reject(Error("failed to patch:", resource, updatedResource));
          }
        });
      }
    });
  }
}
