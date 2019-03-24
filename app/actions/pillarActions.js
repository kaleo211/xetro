import Utils from '../components/Utils';
import { setBoard } from './boardActions';

export const postPillar = (pillar) => {
  return (dispatch) => {
    return Utils.post('pillars', pillar).then(() => {
      dispatch(setBoard(pillar.boardId));
    });
  };
};

export const patchPillar = (pillar) => {
  return (dispatch) => {
    Utils.patch('pillars', pillar).then(() => {
      dispatch(setBoard(pillar.boardId));
    });
  };
};
