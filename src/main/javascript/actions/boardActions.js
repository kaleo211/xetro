import {
  FETCH_ACTIVE_BOARDS,
  FETCH_BOARD,
  FETCH_TEAM_ACTIVE_BOARDS,
  POST_BOARD,
  UPDATE_SELECTED_MEMBER
} from './types';
import Utils from '../components/Utils';

export const fetchTeamActiveBoards = (teamID) => dispatch => {
  return new Promise((resolve, reject) => {
    Utils.fetchResource("boards/active/team/" + teamID, (body => {
      let boards = body._embedded && body._embedded.boards || [];
      dispatch({
        type: FETCH_TEAM_ACTIVE_BOARDS,
        boards
      });
      resolve(boards);
    }));
  });
};

export const fetchActiveBoards = () => dispatch => {
  Utils.fetchResource("boards/active", (body => {
    let boards = body._embedded.boards;
    dispatch({
      type: FETCH_ACTIVE_BOARDS,
      boards
    });
  }));
};

export const postBoard = (board) => dispatch => {
  Utils.postResource("boards", board, (body => {
    let board = body._embedded.board;
    dispatch({
      type: POST_BOARD,
      board
    });
  }));
};

export const selectBoard = (boardID) => dispatch => {
  Utils.fetchResource("boards/" + boardID, (body => {
    let board = Utils.reformBoard(body);
    dispatch({
      type: FETCH_BOARD,
      board
    });
  }));
};

export const updateSelectedMember = (memberID) => dispatch => {
  Utils.fetchResource("members/" + memberID, (body => {
    let selectedMember = body;
    dispatch({
      type: UPDATE_SELECTED_MEMBER,
      selectedMember
    });
  }));
}
