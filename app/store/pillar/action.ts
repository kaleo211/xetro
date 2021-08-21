import { AnyAction, Dispatch } from 'redux';
import { PillarI } from '../../../types/models';
import Utils from '../../components/Utils';
import { setBoardRaw } from '../board/action';
import { AppThunk } from '../types';

export const postPillar = (pillar: PillarI): AppThunk => {
  return async (dispatch: Dispatch): Promise<AnyAction> => {
    await Utils.post('pillars', pillar);
    return dispatch(await setBoardRaw(pillar.boardID));
  }
};

export const patchPillar = (pillar: PillarI): AppThunk => {
  return async (dispatch: Dispatch): Promise<AnyAction> => {
    await Utils.patch('pillars', pillar);
    return dispatch(await setBoardRaw(pillar.boardID));
  }
};

export const deletePillar = (pillar: PillarI): AppThunk => {
  return async (dispatch: Dispatch): Promise<AnyAction> => {
    await Utils.delete('pillars', pillar.id);
    return dispatch(await setBoardRaw(pillar.boardID));
  }
};
