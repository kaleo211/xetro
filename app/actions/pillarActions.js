import Utils from '../components/Utils';
import { setBoard } from './boardActions';

export const postPillar = (pillar) => (dispatch) => {
  Utils.post('pillars', pillar).then(() => {
    dispatch(setBoard(pillar.boardID));
  });
};

export const patchPillar = (pillar) => (dispatch) => {
  Utils.patch('pillars', pillar).then(() => {
    dispatch(setBoard(pillar.boardID));
  });
};

export const deletePillar = (pillar) => (dispatch) => {
  Utils.delete('pillars', pillar.id).then(() => {
    dispatch(setBoard(pillar.boardID));
  });
};
