import {
  PATCH_PILLAR,
  POST_PILLAR,
} from './types';
import Utils from '../components/Utils';
import { setBoard } from './boardActions';

export const postPillar = (pillar, bID) => {
  return (dispatch) => {
    return Utils.postResource("pillars", pillar).then(body => {
      let pillar = Utils.reform(body);
      dispatch({
        type: POST_PILLAR,
        pillar,
      });
      dispatch(setBoard(bID));
    });
  };
};

export const patchPillar = (p, pillar, bID) => {
  return (dispatch) => {
    Utils.patch(p, pillar).then(body => {
      let pillar = Utils.reform(body);
      dispatch({
        type: PATCH_PILLAR,
        pillar,
      });
      dispatch(setBoard(bID));
    });
  };
};
