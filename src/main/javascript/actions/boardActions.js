import {
  FETCH_ACTIVE_BOARDS,
  FETCH_BOARD,
  FETCH_TEAM_ACTIVE_BOARDS,
  PATCH_BOARD,
  POST_BOARD,
  UPDATE_SELECTED_MEMBER
} from './types';
import Utils from '../components/Utils';

export const fetchTeamActiveBoards = (teamID) => {
  return new Promise((resolve, reject) => {
    Utils.fetchResource("boards/active/team/" + teamID, (body => {
      let boards = body._embedded && body._embedded.boards || [];
      resolve({
        type: FETCH_TEAM_ACTIVE_BOARDS,
        boards
      });
    }));
  });
};

export const fetchActiveBoards = () => {
  return new Promise((resolve, reject) => {
    Utils.fetchResource("boards/active", (body => {
      let boards = body._embedded.boards;
      dispatch({
        type: FETCH_ACTIVE_BOARDS,
        boards
      });
    }));
  });
};

export const postBoard = (board) => {
  return new Promise((resolve, reject) => {
    Utils.postResource("boards", board, (body => {
      let board = Utils.reform(body);
      console.log("posted new board in action:", body);
      resolve({
        type: POST_BOARD,
        board
      });
    }));
  });
};

export const patchBoard = (b, board) => {
  return new Promise((resolve, reject) => {
    Utils.patchResource(b, board).then(body => {
      let board = Utils.reform(body);
      console.log("posted new board in action:", body);
      resolve({
        type: PATCH_BOARD,
        board
      });
    });
  });
};

export const selectBoard = (boardID) => {
  return new Promise((resolve, reject) => {
    if (boardID === null || boardID === "") {
      resolve({
        type: FETCH_BOARD,
        board: null
      });
    } else {
      Utils.fetchResource("boards/" + boardID).then(body => {
        let board = Utils.reformBoard(body);
        resolve({
          type: FETCH_BOARD,
          board
        });
      });
    }
  });
};

export const updateSelectedMember = (memberID) => {
  return new Promise((resolve, reject) => {
    Utils.fetchResource("members/" + memberID).then(body => {
      let selectedMember = body;
      resolve({
        type: UPDATE_SELECTED_MEMBER,
        selectedMember
      });
    });
  });
};
