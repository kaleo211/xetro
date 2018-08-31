import React from 'react';

export default class Board extends React.Component {

  static fetchResource(resource, callback) {
    let url = window.location.protocol + "//" + window.location.hostname + ":8080/api/" + resource;

    fetch(url)
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        } else {
          throw new Error("failed to fetch:", url);
        }
      }).then(data => {
        callback(data);
      }).catch(error => {
        console.log(error);
      });
  }

  static postResource(resourceType, resource, callback) {
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
  }

  static patchResource(url, resource, callback) {
    fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(resource),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then(resp => {
      if (resp.ok) {
        return resp.json();
      } else {
        throw new Error("failed to patch:", url);
      }
    }).then(data => {
      callback(data);
    });
  }
}
