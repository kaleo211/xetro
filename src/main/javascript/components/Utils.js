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

  get(url, callback) {
    if (url) {
      fetch(url.replace('{?projection}', ''))
        .then(resp => {
          if (resp.ok) {
            return resp.json();
          } else {
            throw new Error("failed to get:", url);
          }
        }).then(data => {
          callback(data);
        }).catch(error => {
          console.log(error);
        });
    }
  },

  delete(resource, callback) {
    let url = this.prepend(resource);
    fetch(url, {
      method: 'delete',
    }).then(resp => {
      if (!resp.ok) {
        throw new Error("failed to delete:", url);
      }
    }).then(data => {
      callback(data);
    }).catch(error => {
      console.log(error);
    });
  },

  deleteResource(resource, callback) {
    let url = resource._links.self.href.replace('{?projection}', '');
    fetch(url, {
      method: 'delete',
    }).then(resp => {
      if (!resp.ok) {
        throw new Error("failed to delete:", url);
      }
    }).then(data => {
      callback(data);
    }).catch(error => {
      console.log(error);
    });
  },

  fetchResource(resourceType, callback) {
    let url = window.location.protocol + "//" + window.location.hostname + ":8080/api/" + resourceType;
    this.get(url, callback);
  },

  getSelfLink(resource) {
    if (resource && resource._links) {
      return resource._links.self.href.replace('{?projection}', '');
    }
    return null;
  },

  postPillar(pillar, callback) {
    this.postResource("pillars", pillar, callback);
  },

  postTeamMember(teamMember, callback) {
    this.postResource("teamMember", teamMember, callback);
  },

  postResource(resourceType, resource, callback) {
    let url = window.location.protocol + "//" + window.location.hostname + ":8080/api/" + resourceType;
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(resource),
      headers: new Headers({
        'Content-Type': 'application/json',
      })
    }).then(resp => {
      if (resp.ok) {
        return resp.json();
      } else {
        throw new Error("failed to post:", resourceType, resource);
      }
    }).then(data => {
      callback(data);
    }).catch(error => {
      console.log(error);
    });
  },

  patch(resource, updatedResource, callback) {
    let url = this.prepend(resource);
    if (url) {
      fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(updatedResource),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      }).then(resp => {
        if (resp.ok) {
          return resp.json();
        } else {
          throw new Error("failed to patch:", resource, updatedResource);
        }
      }).then(data => {
        callback(data);
      });
    }
  },

  patchResource(resource, updatedResource, callback) {
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
          return resp.json();
        } else {
          throw new Error("failed to patch:", resource, updatedResource);
        }
      }).then(data => {
        callback(data);
      });
    }
  }
}
