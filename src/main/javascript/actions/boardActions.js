import {
  FETCH_ACTIVE_BOARDS,
  FETCH_BOARD,
  FETCH_TEAM_ACTIVE_BOARDS,
  PATCH_BOARD,
  POST_BOARD,
  UPDATE_SELECTED_MEMBER,
  SHOW_PAGE,
  FETCH_BOARDS,
} from './types';
import Utils from '../components/Utils';

export const fetchTeamActiveBoards = (teamID) => {
  return (dispatch) => {
    Utils.fetchResource("boards/active/team/" + teamID).then(body => {
      let page = "boardCreate";
      let boards = body._embedded && body._embedded.boards || [];

      if (boards) {
        if (boards.length === 1) {
          dispatch(selectBoard(boards[0].id));
          page = "board";
        } if (boards.length > 1) {
          page = "boardList";
        }
      }

      dispatch({
        type: FETCH_TEAM_ACTIVE_BOARDS,
        boards
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
      dispatch({
        type: POST_BOARD,
        board
      });
    });
  };
};

export const fetchBoards = () => {
  return (dispatch) => {
    return Utils.fetchResource("boards").then(body => {
      let boards = body._embedded.boards;
      dispatch({
        type: FETCH_BOARDS,
        boards
      });
    });
  };
};

export const patchBoard = (b, board) => {
  return (dispatch) => {
    Utils.patchResource(b, board).then(body => {
      let board = Utils.reform(body);
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
