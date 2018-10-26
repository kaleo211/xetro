import {
  PATCH_PILLAR,
  POST_PILLAR,
} from './types';
import Utils from '../components/Utils';

export const postPillar = (pillar) => {
  return new Promise((resolve, reject) => {
    Utils.postResource("pillars", pillar).then(body => {
      let pillar = Utils.reform(body);
      resolve({
        type: POST_PILLAR,
        pillar
      });
    });
  });
};

export const patchPillar = (p, pillar) => {
  return new Promise((resolve, reject) => {
    Utils.patch(p, pillar, (body => {
      let pillar = Utils.reform(body);
      resolve({
        type: PATCH_PILLAR,
        pillar,
      });
    }));
  });
};
