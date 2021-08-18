import { Dispatch } from 'redux';
import { PillarI } from '../../../types/models';
import Utils from '../../components/Utils';
import { setBoard } from '../board/action';
import { AppThunk } from '../types';

export const postPillar = (pillar:PillarI): AppThunk => async (dispatch:Dispatch) => {
  await Utils.post('pillars', pillar);
  dispatch(setBoard(pillar.boardID));
};

export const patchPillar = (pillar:PillarI): AppThunk => async (dispatch:Dispatch) => {
  await Utils.patch('pillars', pillar);
  dispatch(setBoard(pillar.boardID));
};

export const deletePillar = (pillar:PillarI): AppThunk => async (dispatch:Dispatch) => {
  await Utils.delete('pillars', pillar.id);
  dispatch(setBoard(pillar.boardID));
};
