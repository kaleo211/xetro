import { FETCH_TEAMS } from './types';
import Utils from '../components/Utils';

export const fetchTeams = () => dispatch => {
  Utils.fetchResource("teams", (body => {
    console.log("#App# fetched teams:", body);
    dispatch({
      type: FETCH_TEAMS,
      payload: body._embedded.teams
    });
  }));
}
