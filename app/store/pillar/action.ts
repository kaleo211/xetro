import { AnyAction, Dispatch } from 'redux';

import { deleteReq, patchReq, postReq } from '../../utils';
import { PillarI } from '../../../types/models';
import { setBoardRaw } from '../board/action';
import { AppThunk } from '../types';

export const postPillar = (pillar: PillarI): AppThunk => {
  return async (dispatch: Dispatch): Promise<AnyAction> => {
    await postReq('pillars', pillar);
    return dispatch(await setBoardRaw(pillar.boardID));
  }
};

export const patchPillar = (pillar: PillarI): AppThunk => {
  return async (dispatch: Dispatch): Promise<AnyAction> => {
    await patchReq('pillars', pillar);
    return dispatch(await setBoardRaw(pillar.boardID));
  }
};

export const deletePillar = (pillar: PillarI): AppThunk => {
  return async (dispatch: Dispatch): Promise<AnyAction> => {
    await deleteReq('pillars', pillar.id);
    return dispatch(await setBoardRaw(pillar.boardID));
  }
};
