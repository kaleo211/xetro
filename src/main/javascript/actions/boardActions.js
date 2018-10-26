import {
  FETCH_ACTIVE_BOARDS,
  FETCH_BOARD,
  FETCH_TEAM_ACTIVE_BOARDS,
  PATCH_BOARD,
  POST_BOARD,
  UPDATE_SELECTED_MEMBER,
  SHOW_PAGE,
} from './types';
import Utils from '../components/Utils';

export const fetchTeamActiveBoards = (teamID) => {
  return (dispatch) => {
    Utils.fetchResource("boards/active/team/" + teamID).then(body => {
      let page = "boardCreate";
      let board = null;
      let boards = body._embedded && body._embedded.boards || [];
      if (boards) {
        if (boards.length === 1) {
          board = boards[0].id;
          page = "board";
        } if (boards.length > 1) {
          page = "activeBoards";
        }
      }

      dispatch({
        type: FETCH_TEAM_ACTIVE_BOARDS,
        boards
      });
      dispatch({
        type: POST_BOARD,
        board,
      });
      dispatch({
        type: SHOW_PAGE,
        page,
      });
    });
  };
};

export const fetchActiveBoards = () => {
  return (dispatch) => {
    Utils.fetchResource("boards/active").then(body => {
      let boards = body._embedded.boards;
      dispatch({
        type: FETCH_ACTIVE_BOARDS,
        boards
      });
    });
  };
};

export const postBoard = (board) => {
  return (dispatch) => {
    Utils.postResource("boards", board).then(body => {
      let board = Utils.reform(body);
      console.log("posted new board in action:", body);
      dispatch({
        type: POST_BOARD,
        board
      });
    });
  };
};

export const patchBoard = (b, board) => {
  return (dispatch) => {
    Utils.patchResource(b, board).then(body => {
      let board = Utils.reform(body);
      console.log("posted new board in action:", body);
      dispatch({
        type: PATCH_BOARD,
        board
      });
    });
  };
};

export const selectBoard = (boardID) => {
  return (dispatch) => {
    if (boardID === null || boardID === "") {
      dispatch({
        type: FETCH_BOARD,
        board: null
      });
    } else {
      Utils.fetchResource("boards/" + boardID).then(body => {
        let board = Utils.reformBoard(body);
        dispatch({
          type: FETCH_BOARD,
          board
        });
      });
    }
  };
};

export const updateSelectedMember = (memberID) => {
  return (dispatch) => {
    Utils.fetchResource("members/" + memberID).then(body => {
      let selectedMember = body;
      dispatch({
        type: UPDATE_SELECTED_MEMBER,
        selectedMember
      });
    });
  };
};
