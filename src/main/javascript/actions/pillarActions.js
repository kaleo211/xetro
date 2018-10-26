import {
  PATCH_PILLAR,
  POST_PILLAR,
} from './types';
import Utils from '../components/Utils';

export const postPillar = (pillar) => {
  return (dispatch) => {
    Utils.postResource("pillars", pillar).then(body => {
      let pillar = Utils.reform(body);
      dispatch({
        type: POST_PILLAR,
        pillar
      });
    });
  };
};

export const patchPillar = (p, pillar) => {
  return (dispatch) => {
    Utils.patch(p, pillar, (body => {
      let pillar = Utils.reform(body);
      dispatch({
        type: PATCH_PILLAR,
        pillar,
      });
    }));
  };
};
