import Utils from '../components/Utils';
import { setBoard } from './boardActions';
import { SET_PILLARS } from './types';

export const postPillar = (pillar) => {
  return (dispatch) => {
    Utils.post('pillars', pillar).then(() => {
      dispatch(setBoard(pillar.boardId));
    });
  };
};

export const setPillars = (boardId) => {
  return (dispatch) => {
    Utils.fetch(`/pillars/board/${boardId}`).then(body => {
      dispatch({
        type: SET_PILLARS,
        pillars: body,
      })
    })
  }
}

export const patchPillar = (pillar) => {
  return (dispatch) => {
    Utils.patch('pillars', pillar).then(() => {
      dispatch(setBoard(pillar.boardId));
    });
  };
};
